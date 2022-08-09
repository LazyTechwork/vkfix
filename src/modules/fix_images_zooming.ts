export const fixImagesZoomingCss = `
#pv_photo {
   display: flex !important;
   align-items: center;
}

#pv_photo img {
  max-width: 100%;
  max-height: 100%;
  margin-top: 0 !important;
  width: auto !important;
  height: auto !important;
  display: flex;
  justify-content: center;
  align-content: center;
}

.pv_img_progress_wrap {
  display: flex;
  align-items: center;
}

#pv_image_progress {
  margin-top: 0 !important;
}


@media(resolution: 1.25dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.875;
  }
}
@media(resolution: 1.5dppx) { 
 #pv_photo img, img.can_zoom {
      zoom: 0.75;
  }
}
@media(resolution: 1.75dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.625;
  }
}
@media(resolution: 2dppx) { 
  [dir] #pv_photo img, img.can_zoom {
      zoom: 0.5;
  }
}
`;
