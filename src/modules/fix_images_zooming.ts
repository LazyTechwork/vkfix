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
@media(resolution: 2.25dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.4444;
  }
}
@media(resolution: 2.5dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.4;
  }
}
@media(resolution: 2.75dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.3636;
  }
}
@media(resolution: 3dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.3333;
  }
}
@media(resolution: 3.5dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.285714;
  }
}
@media(resolution: 4dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.25;
  }
}
@media(resolution: 4.5dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.222222;
  }
}
@media(resolution: 5dppx) { 
  #pv_photo img, img.can_zoom {
      zoom: 0.2;
  }
}
`;
