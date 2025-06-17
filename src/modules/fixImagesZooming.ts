import { useDevicePixelRatio } from "@vueuse/core";
import { watch } from "vue";

const { pixelRatio } = useDevicePixelRatio();

watch(
  pixelRatio,
  (pixelRatio) => {
    document.documentElement.style.setProperty(
      "--device-pixel-ratio",
      `${pixelRatio}`
    );
  },
  { immediate: true }
);

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

#pv_photo img, img.can_zoom {
  zoom: calc(1 / var(--device-pixel-ratio));
}
`;
