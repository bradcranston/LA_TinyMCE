// Self-hosted TinyMCE — no API key or CDN needed in FileMaker WebViewer
import tinymce from 'tinymce';

// Theme, model, and icons (all required for TinyMCE 8)
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';
import 'tinymce/icons/default/icons.min.js';

// NOTE: skin CSS is imported via src/style.css so Parcel inlines it
// into the HTML <style> block — no separate CSS file needed.

// Open-source plugins
import 'tinymce/plugins/anchor/plugin.min.js';
import 'tinymce/plugins/autolink/plugin.min.js';
import 'tinymce/plugins/charmap/plugin.min.js';
import 'tinymce/plugins/codesample/plugin.min.js';
import 'tinymce/plugins/emoticons/plugin.min.js';
import 'tinymce/plugins/link/plugin.min.js';
import 'tinymce/plugins/lists/plugin.min.js';
import 'tinymce/plugins/advlist/plugin.min.js';
import 'tinymce/plugins/media/plugin.min.js';
import 'tinymce/plugins/searchreplace/plugin.min.js';
import 'tinymce/plugins/table/plugin.min.js';
import 'tinymce/plugins/visualblocks/plugin.min.js';
import 'tinymce/plugins/wordcount/plugin.min.js';
import 'tinymce/plugins/fullscreen/plugin.min.js';
import 'tinymce/plugins/code/plugin.min.js';
import 'tinymce/plugins/image/plugin.min.js';

function saveToFileMaker() {
  const html = tinymce.activeEditor.getContent();
  const param = JSON.stringify({ mode: 'save', html });
  FileMaker.PerformScript('Manage: TinyMCE', param);
}

function loadFromFileMaker(html) {
  tinymce.activeEditor.setContent(html);
}

// Expose globally so FileMaker can call these via WebViewer PerformJavaScript
window.saveToFileMaker = saveToFileMaker;
window.loadFromFileMaker = loadFromFileMaker;

tinymce.init({
  selector: 'textarea',
  height: 800,

  // Required for self-hosted open-source use — suppresses the
  // licensekeymanager plugin that otherwise tries to fetch from the CDN
  license_key: 'gpl',

  // Prevent TinyMCE from fetching skin/content CSS dynamically
  skin: false,
  content_css: false,

  // Default font and font size for editor content
  content_style: 'body { font-family: Verdana, sans-serif; font-size: 14px; line-height: 1.5; }',
  font_size_default: '14px',
  font_family_default: 'Verdana, sans-serif',
  font_family_formats: 'Verdana=Verdana, sans-serif',
  lineheight_formats: '1 1.15 1.5 2 2.5 3',
  font_size_formats: '8px 9px 10px 11px 12px 14px 16px 18px 20px 24px 28px 36px 48px 72px',

  color_map: [
    '000000', 'Black',
    'FF0000', 'Red',
    '00FF00', 'Green',
    '0000FF', 'Blue',
    'FFFF00', 'Yellow',
    'FFA500', 'Orange',
    '800080', 'Purple',
    'FFFFFF', 'White',
  ],

  plugins: [
    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons',
    'link', 'lists', 'advlist', 'media', 'searchreplace',
    'table', 'visualblocks', 'wordcount', 'fullscreen', 'code', 'image',
  ],

  toolbar:
    'fontfamily fontsize | bold italic | forecolor | lineheight | aligncenter hr | indent outdent bullist numlist | link image code',

  setup(editor) {
    // Apply a default width of 500px to images that have no explicit width
    editor.on('NodeChange', (e) => {
      if (
        e.element.nodeName === 'IMG' &&
        !e.element.getAttribute('width') &&
        !e.element.style.width
      ) {
        editor.dom.setAttrib(e.element, 'width', '500');
      }
    });

    editor.ui.registry.addButton('save', {
      text: 'Save',
      icon: 'save',
      tooltip: 'Save to FileMaker',
      onAction() {
        saveToFileMaker();
      },
    });
  },
});
