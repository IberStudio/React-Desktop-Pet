
// ======== IMPORT IMAGE ================
import gear from "../assets/icons/gear.png";
import list from "../assets/icons/list.png";
import home from "../assets/icons/home.png";
import tick from "../assets/icons/tick.png";
import shop from "../assets/icons/shop.png";
import cross from "../assets/icons/cross.png";
import trashCan from "../assets/icons/trash-can.png";
import mainIcon from "../assets/icons/main-icon.svg";
import minimize from "../assets/icons/minimize.png";
import play from "../assets/icons/play.png";
import pause from "../assets/icons/pause.png";
import next from "../assets/icons/next.png";
import previous from "../assets/icons/previous.png";
import replay from "../assets/icons/replay.png";
import music from "../assets/icons/music.png";
import upArrow from "../assets/icons/up-arrow.png";
import downArrow from "../assets/icons/down-arrow.png";
import petIcon from "../assets/icons/pet.png";
import restore from "../assets/icons/restore.png";
import miniDisplay from "../assets/icons/mini-display.png";
import calendar from "../assets/icons/calendar.png";
import chevLeft from "../assets/icons/chevLeft.png";
import chevRight from "../assets/icons/chevRight.png";
import add from "../assets/icons/add.png";
import question from "../assets/icons/question.png";

export const icons = {
    gear,
    list,
    home,
    tick,
    shop,
    cross,
    trashCan,
    mainIcon,
    minimize,
    play,
    pause,
    next,
    previous,
    replay,
    music,
    upArrow,
    downArrow,
    petIcon,
    restore,
    miniDisplay,
    calendar,
    chevLeft,
    chevRight,
    add,
    question
} as const;

import baseBorder from "../assets/borders/base.png";
import titleBar from "../assets/borders/titleBar.png";
import content from "../assets/borders/content.png";
import activeTab from "../assets/borders/activeTab.png";
import unactiveTab from "../assets/borders/unactiveTab.png";

export const borders = {
    baseBorder,
    titleBar,
    content,
    activeTab,
    unactiveTab,
} as const;

export type BorderName = keyof typeof borders;

import darkBrownButton from "../assets/buttons/brown.png";
import lightBrownButton from "../assets/buttons/lightBrown.png";
import whiteButton from "../assets/buttons/white.png";
import greenButton from "../assets/buttons/green.png";
import redButton from "../assets/buttons/red.png";
import baseButton from "../assets/buttons/base.png";

export const buttons = {
    darkBrownButton,
    lightBrownButton,
    whiteButton,
    greenButton,
    redButton,
    baseButton,
} as const;

export type ButtonName = keyof typeof buttons;



import emptyLoading from "../assets/loading/bar-empty.png";
import filledLoading from "../assets/loading/bar-filled.png";

export const loadings = {
    emptyLoading,
    filledLoading,
}

