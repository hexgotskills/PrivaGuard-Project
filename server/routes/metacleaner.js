import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import exifr from 'exifr';
import { PDFDocument } from 'pdf-lib';
import mime from 'mime-types';
import { metaCleanerLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
router.use(metaCleanerLimiter);

const SUPPORTED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png',
  'image/tiff', 'image/webp', 'image/heic',
  'application/pdf'
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    if (SUPPORTED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Upload JPEG, PNG, TIFF, WEBP, HEIC, or PDF.'));
    }
  }
});

router.post('/extract', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const { buffer, mimetype, originalname, size } = req.file;
    const isImage = mimetype.startsWith('image/');
    const isPDF = mimetype === 'application/pdf';

    let metadata = {};
    let groups = [];

    if (isImage) {
      const raw = await exifr.parse(buffer, {
        gps: true, ifd0: true, exif: true,
        xmp: true, iptc: true, jfif: true,
        tiff: true, ifd1: true
      }) || {};

      // GPS group
      if (raw.latitude != null && raw.longitude != null) {
        groups.push({
          icon: '📍',
          label: 'Location',
          fields: [
            { key: 'Coordinates', value: `${raw.latitude.toFixed(6)}, ${raw.longitude.toFixed(6)}` },
            raw.GPSAltitude != null && { key: 'Altitude', value: `${Math.round(raw.GPSAltitude)} m` },
            raw.GPSImgDirection != null && { key: 'Direction', value: `${Math.round(raw.GPSImgDirection)}°` }
          ].filter(Boolean)
        });
      }

      // Device group
      const deviceFields = [
        raw.Make && { key: 'Manufacturer', value: raw.Make },
        raw.Model && { key: 'Model', value: raw.Model },
        raw.Software && { key: 'Software', value: raw.Software }
      ].filter(Boolean);
      if (deviceFields.length) groups.push({ icon: '📱', label: 'Device', fields: deviceFields });

      // Date & Time group
      const date = raw.DateTimeOriginal || raw.CreateDate || raw.DateTime;
      if (date) {
        groups.push({
          icon: '📅',
          label: 'Date & Time',
          fields: [
            { key: 'Captured', value: new Date(date).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }) }
          ]
        });
      }

      // Camera settings group
      const cameraFields = [
        raw.ExifImageWidth && raw.ExifImageHeight && { key: 'Resolution', value: `${raw.ExifImageWidth} × ${raw.ExifImageHeight} px` },
        raw.FNumber && { key: 'Aperture', value: `f/${raw.FNumber}` },
        raw.ExposureTime && { key: 'Shutter Speed', value: raw.ExposureTime < 1 ? `1/${Math.round(1/raw.ExposureTime)}s` : `${raw.ExposureTime}s` },
        raw.ISO && { key: 'ISO', value: String(raw.ISO) },
        raw.FocalLength && { key: 'Focal Length', value: `${raw.FocalLength}mm` }
      ].filter(Boolean);
      if (cameraFields.length) groups.push({ icon: '📷', label: 'Camera Settings', fields: cameraFields });

      // Creator group
      const creatorFields = [
        raw.Artist && { key: 'Artist', value: raw.Artist },
        raw.Copyright && { key: 'Copyright', value: raw.Copyright },
        raw.ImageDescription && { key: 'Description', value: raw.ImageDescription }
      ].filter(Boolean);
      if (creatorFields.length) groups.push({ icon: '✍️', label: 'Creator Info', fields: creatorFields });

    } else if (isPDF) {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pdfFields = [
        pdfDoc.getTitle() && { key: 'Title', value: pdfDoc.getTitle() },
        pdfDoc.getAuthor() && { key: 'Author', value: pdfDoc.getAuthor() },
        pdfDoc.getSubject() && { key: 'Subject', value: pdfDoc.getSubject() },
        pdfDoc.getCreator() && { key: 'Creator Software', value: pdfDoc.getCreator() },
        pdfDoc.getProducer() && { key: 'Producer', value: pdfDoc.getProducer() },
        pdfDoc.getKeywords() && { key: 'Keywords', value: pdfDoc.getKeywords() },
        pdfDoc.getCreationDate() && { key: 'Created', value: pdfDoc.getCreationDate().toLocaleDateString('en-IN') },
        pdfDoc.getModificationDate() && { key: 'Last Modified', value: pdfDoc.getModificationDate().toLocaleDateString('en-IN') }
      ].filter(Boolean);

      if (pdfFields.length) {
        groups.push({ icon: '📄', label: 'Document Info', fields: pdfFields });
      }
    }

    const totalFields = groups.reduce((acc, g) => acc + g.fields.length, 0);

    return res.json({
      filename: originalname,
      filesize: `${(size / 1024).toFixed(1)} KB`,
      mimetype,
      totalFieldsFound: totalFields,
      hasGPS: groups.some(g => g.label === 'Location'),
      groups
    });

  } catch (err) {
    if (err.message?.includes('multer') || err.message?.includes('Unsupported')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

router.post('/clean', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const { buffer, mimetype, originalname } = req.file;
    const isImage = mimetype.startsWith('image/');
    const isPDF = mimetype === 'application/pdf';
    const ext = mime.extension(mimetype) || 'bin';

    let cleanBuffer;

    if (isImage) {
      cleanBuffer = await sharp(buffer).rotate().toBuffer();
    } else if (isPDF) {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setCreator('');
      pdfDoc.setProducer('PrivaGuard Metadata Cleaner');
      pdfDoc.setKeywords([]);
      pdfDoc.setCreationDate(new Date(0));
      pdfDoc.setModificationDate(new Date(0));
      cleanBuffer = Buffer.from(await pdfDoc.save());
    }

    const baseName = originalname.replace(/\.[^/.]+$/, '');
    const cleanName = `clean_${baseName}.${ext}`;

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${cleanName}"`,
      'Content-Length': cleanBuffer.length
    });

    return res.send(cleanBuffer);

  } catch (err) {
    if (err.message?.includes('multer') || err.message?.includes('Unsupported')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
