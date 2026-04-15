/**
 * ChromaSense AI — Frontend entry point.
 *
 * Wires DOM event listeners, binds DOM refs into each module's internal
 * `dom` bag, and kicks off init routines (language, navbar, hero labels).
 */

import { state } from './state.js';
import { applyLanguage } from './i18n.js';
import { initNavbarScroll } from './services/navbar.js';
import { initHeroColorLabels } from './services/hero-labels.js';
import { bindApiElements, analyzeImage, loadModelInfo } from './services/api.js';
import { bindUiElements, showUploadArea } from './services/ui.js';
import { bindUploadElements, handleFile, clearPreview } from './services/upload.js';
import { bindCameraElements, openCamera, capturePhoto, closeCamera } from './services/camera.js';
import { bindResultElements, filterOutfits } from './renderers/results.js';
import { renderClothingType } from './renderers/clothing.js';
/* Ensure window.copyColor is registered for inline SVG onclick handlers. */
import './utils/dom.js';

const $ = (id) => document.getElementById(id);

const dom = {
    uploadArea:        $('uploadArea'),
    uploadMethods:     document.querySelector('.upload-methods'),
    fileUploadCard:    $('fileUploadCard'),
    cameraCard:        $('cameraCard'),
    fileInput:         $('fileInput'),
    preview:           $('previewContainer'),
    previewImage:      $('previewImage'),
    camera:            $('cameraContainer'),
    video:             $('cameraVideo'),
    canvas:            $('cameraCanvas'),
    loading:           $('loadingContainer'),
    loadingStep:       $('loadingStep'),
    error:             $('errorContainer'),
    errorTitle:        $('errorTitle'),
    errorMessage:      $('errorMessage'),
    results:           $('results'),
};

bindUiElements({
    uploadMethods: dom.uploadMethods,
    preview:       dom.preview,
    loading:       dom.loading,
    error:         dom.error,
    errorTitle:    dom.errorTitle,
    errorMessage:  dom.errorMessage,
});
bindUploadElements({
    uploadMethods: dom.uploadMethods,
    fileInput:     dom.fileInput,
    preview:       dom.preview,
    previewImage:  dom.previewImage,
    camera:        dom.camera,
});
bindCameraElements({
    uploadMethods: dom.uploadMethods,
    camera:        dom.camera,
    video:         dom.video,
    canvas:        dom.canvas,
    previewImage:  dom.previewImage,
});
bindApiElements({
    preview:      dom.preview,
    previewImage: dom.previewImage,
    loading:      dom.loading,
    loadingStep:  dom.loadingStep,
});
bindResultElements({
    results:      dom.results,
    previewImage: dom.previewImage,
});

/* ── Upload card ── */
dom.fileUploadCard.addEventListener('click', () => dom.fileInput.click());
dom.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
});
dom.fileUploadCard.addEventListener('dragover', (e) => {
    e.preventDefault();
    dom.fileUploadCard.classList.add('dragover');
});
dom.fileUploadCard.addEventListener('dragleave', () =>
    dom.fileUploadCard.classList.remove('dragover')
);
dom.fileUploadCard.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.fileUploadCard.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

/* ── Camera ── */
dom.cameraCard.addEventListener('click', openCamera);
$('captureBtn').addEventListener('click', capturePhoto);
$('closeCameraBtn').addEventListener('click', closeCamera);

/* ── Analyze flow ── */
$('clearBtn').addEventListener('click', clearPreview);
$('analyzeBtn').addEventListener('click', analyzeImage);
$('retryBtn').addEventListener('click', () => {
    dom.error.style.display = 'none';
    showUploadArea();
});
$('newAnalysisBtn').addEventListener('click', () => {
    dom.results.style.display = 'none';
    clearPreview();
    showUploadArea();
    $('analyze').scrollIntoView({ behavior: 'smooth' });
});

/* ── Tabs ── */
$('clothingTabs').addEventListener('click', (e) => {
    if (!e.target.classList.contains('tab')) return;
    document.querySelectorAll('#clothingTabs .tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    renderClothingType(e.target.dataset.tab);
});
$('outfitTabs').addEventListener('click', (e) => {
    if (!e.target.classList.contains('tab')) return;
    document.querySelectorAll('#outfitTabs .tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    filterOutfits(e.target.dataset.tab);
});

/* ── Language toggle ── */
$('langToggle').addEventListener('click', () => {
    applyLanguage(state.lang === 'mn' ? 'en' : 'mn');
});

/* ── Init ── */
initNavbarScroll();
initHeroColorLabels();
applyLanguage(state.lang);
loadModelInfo();
