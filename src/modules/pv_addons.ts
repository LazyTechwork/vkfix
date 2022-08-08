import GlobalConfig from '../GlobalConfig';

export default function () {
  const pvExpand = GlobalConfig.Config.get('pvExpand');
  if (!pvExpand) {
    return;
  }

  const pvBox = document.getElementById('pv_box');
  if (!pvBox) {
    return;
  }

  const pvBottomInfo = pvBox.querySelector('.pv_bottom_info') as HTMLDivElement | undefined;
  if (!pvBottomInfo) {
    console.info('pv_bottom_info not found');
    return;
  }

  const pvBottomActions = pvBottomInfo.querySelector('.pv_bottom_actions') as HTMLDivElement | undefined;
  const pvPhoto = pvBox.querySelector(`#pv_photo`) as HTMLDivElement | undefined;
  if (!pvBottomActions || !pvPhoto) {
    console.info('pv_bottom_actions or pv_photo not found');
    return;
  }

  const prependDivider = () => {
    const dividerEl = document.createElement('span');
    dividerEl.classList.add('divider');
    pvBottomActions.prepend(dividerEl);
  };

  prependDivider();
  const expandBtn = document.createElement('a');
  expandBtn.id = 'pv_expand_photo';
  expandBtn.innerHTML = `Расширить`;
  let stateExpand = false;

  expandBtn.addEventListener('click', () => {
    const img = pvPhoto.querySelector(`img`) as HTMLImageElement | undefined;
    if (!img) {
      console.info('img not found');
      return;
    }

    if (stateExpand) {
      img.style.removeProperty('width');
      img.style.removeProperty('height');
      img.style.removeProperty('object-fit');
    } else {
      img.style.setProperty('width', '100%', 'important');
      img.style.setProperty('height', '100%', 'important');
      img.style.setProperty('object-fit', 'contain', 'important');
    }

    stateExpand = !stateExpand;
  });

  pvBottomActions.prepend(expandBtn);
}
