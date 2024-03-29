import {createVkUiButton} from "../common/helpers/uiHelpers";
import {Logger} from "../classes/Logger";
import LocationState from "../classes/LocationState";
import GlobalConfig from "../GlobalConfig";
import {querySelectorWithTimeout} from "../common/helpers/querySelectorWithTimeout";

async function getCurrentProfileId(profile_redesigned: HTMLElement) {
    let cp = LocationState.getCurrentPath();
    if (cp.startsWith("/id")) {
        return cp.slice(3);
    }

    // TODO: переделать получение id на использование метода, когда ApiInteractor заработает
    // const screen_name = cp.slice(1);
    // return ApiInteractor.callApi({
    //     method: "utils.resolveScreenName",
    //     data: {
    //         screen_name,
    //     },
    // });

    const linkSel = profile_redesigned.querySelector("a[href^='/im?sel=']") as HTMLLinkElement | undefined;
    if (linkSel) {
        return linkSel.href.split("/im?sel=")[1];
    }

    const linkAudios = profile_redesigned.querySelector("a[href^='/audios']") as HTMLLinkElement | undefined;
    if (linkAudios) {
        return linkAudios.href.split("/audios")[1];
    }

    const linkAlbums = profile_redesigned.querySelector("a[href^='/albums']") as HTMLLinkElement | undefined;
    if (linkAlbums) {
        return linkAlbums.href.split("/albums")[1];
    }
}


const newsBtnId = "vkfix-newsBtn";

export default async function profile_actions() {
    const isNewsBtn = GlobalConfig.Config.get('newsBtn') as boolean;
    if (!isNewsBtn || document.getElementById(newsBtnId)) {
        return;
    }

    const profile_redesigned = await querySelectorWithTimeout({
        selectors: `#profile_redesigned`
    });
    if (!profile_redesigned) {
        return;
    }

    const ProfileHeader__actions = await querySelectorWithTimeout({
        element: profile_redesigned,
        selectors: `.ProfileHeader__actions`,
    });
    if (!ProfileHeader__actions) {
        Logger.warn('not found ProfileHeader__actions')
        return;
    }

    const ProfileHeaderActions__buttons = await querySelectorWithTimeout({
        element: ProfileHeader__actions,
        selectors: ".ProfileHeaderActions__buttons"
    });
    if (!ProfileHeaderActions__buttons) {
        Logger.warn('not found ProfileHeaderActions__buttons')
        return;
    }

    const userId = await getCurrentProfileId(profile_redesigned);
    const newsBtn = createVkUiButton('Новости', () => {
        window.open(`/feed?section=source&source=${userId}`)
    });
    newsBtn.id = newsBtnId;
    newsBtn.style.marginLeft = '6px';
    ProfileHeaderActions__buttons.appendChild(newsBtn);
}
