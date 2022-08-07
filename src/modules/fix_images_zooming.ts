export const fixImagesZoomingCss = `
[dir] #pv_photo {
   display: flex;
   align-items: center;
}
[dir] #pv_photo img {
  max-width: 100%;
  max-height: 100%;
  width: auto !important;
  height: auto !important;
}


@media(resolution: 1.25dppx) { 
  [dir] #pv_photo img, img.can_zoom {
      zoom: 0.875;
  }
}
@media(resolution: 1.5dppx) { 
  [dir] #pv_photo img, img.can_zoom {
      zoom: 0.75;
  }
}
@media(resolution: 1.75dppx) { 
  [dir] #pv_photo img, img.can_zoom {
      zoom: 0.625;
  }
}
@media(resolution: 2dppx) { 
  [dir] #pv_photo img, img.can_zoom {
      zoom: 0.5;
  }
}
`;
