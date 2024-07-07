/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarAlt, faCalendarAlt as farCalendarAlt } from '@fortawesome/free-regular-svg-icons/faCalendarAlt';
import { faCalendarTimes } from '@fortawesome/free-regular-svg-icons/faCalendarTimes';
import { faTrashAlt as farTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faCheckSquare, faExchangeAlt, faHistory, faList, faPlusCircle, faPlusSquare, fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons/faAddressBook';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons/faAddressCard';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleLeft';
import { faArrowAltCircleLeft as farArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons/faArrowAltCircleLeft';
import { faArrowAltCircleRight as farArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons/faArrowAltCircleRight';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons/faAsterisk';
import { faAward } from '@fortawesome/free-solid-svg-icons/faAward';
import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faBookmark } from '@fortawesome/free-solid-svg-icons/faBookmark';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons/faBriefcase';
import { faBriefcaseMedical } from '@fortawesome/free-solid-svg-icons/faBriefcaseMedical';
import { faBuilding } from '@fortawesome/free-solid-svg-icons/faBuilding';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons/faBullhorn';
import { faBusinessTime } from '@fortawesome/free-solid-svg-icons/faBusinessTime';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons/faClipboardCheck';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons/faClipboardList';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons/faCodeBranch';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faEquals } from '@fortawesome/free-solid-svg-icons/faEquals';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faFileContract } from '@fortawesome/free-solid-svg-icons/faFileContract';
import { faFileExcel } from '@fortawesome/free-regular-svg-icons/faFileExcel';
import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage';
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons/faFileInvoiceDollar';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faHourglassEnd } from '@fortawesome/free-solid-svg-icons/faHourglassEnd';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faInbox } from '@fortawesome/free-solid-svg-icons/faInbox';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faLandmark } from '@fortawesome/free-solid-svg-icons/faLandmark';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkedAlt';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import { faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons/faMoneyBillAlt';
import { faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons/faMoneyCheckAlt';
import { faNotesMedical } from '@fortawesome/free-solid-svg-icons/faNotesMedical';
import { faPassport } from '@fortawesome/free-solid-svg-icons/faPassport';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faReceipt } from '@fortawesome/free-solid-svg-icons/faReceipt';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSitemap } from '@fortawesome/free-solid-svg-icons/faSitemap';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons/faSlidersH';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons/faSortAmountDown';
import { faSortAmountUp } from '@fortawesome/free-solid-svg-icons/faSortAmountUp';
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown';
import { faSortUp } from '@fortawesome/free-solid-svg-icons/faSortUp';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons/faStethoscope';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons/faStopwatch';
import { faSuitcase } from '@fortawesome/free-solid-svg-icons/faSuitcase';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faTasks } from '@fortawesome/free-solid-svg-icons/faTasks';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faTimesCircle as faTimesCircleRegular } from '@fortawesome/free-regular-svg-icons/faTimesCircle';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faTrashAlt as fasTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { faUniversity } from '@fortawesome/free-solid-svg-icons/faUniversity';
import { faUnlink } from '@fortawesome/free-solid-svg-icons/faUnlink';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { faUserClock } from '@fortawesome/free-solid-svg-icons/faUserClock';
import { faUserCog } from '@fortawesome/free-solid-svg-icons/faUserCog';
import { faUserInjured } from '@fortawesome/free-solid-svg-icons/faUserInjured';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faUserShield } from '@fortawesome/free-solid-svg-icons/faUserShield';
import { faUmbrella } from '@fortawesome/free-solid-svg-icons/faUmbrella';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons/faHandHoldingHeart';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons/faCalendarDay';
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons/faHandHoldingUsd';
import { faWallet } from '@fortawesome/free-solid-svg-icons/faWallet';
import { faUserTie } from '@fortawesome/free-solid-svg-icons/faUserTie';

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IconsModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(far, fas); // commented because of bundle size. Please add required icons using addIcons as below
    library.addIcons(
      faAddressBook,
      faAddressCard,
      faAngleDown,
      faAngleLeft,
      faAngleRight,
      faAngleUp,
      faArrowAltCircleLeft,
      farArrowAltCircleLeft,
      farArrowAltCircleRight,
      faArrowLeft,
      faArrowRight,
      faArrowUp,
      faAsterisk,
      faAward,
      faBan,
      faBars,
      faBell,
      faBookmark,
      faBriefcase,
      faBriefcaseMedical,
      faBuilding,
      faBullhorn,
      faBusinessTime,
      faCalendarAlt,
      farCalendarAlt,
      faCalendarTimes,
      faCaretUp,
      faCaretDown,
      faChartBar,
      faChartLine,
      faCheck,
      faCheckCircle,
      faCircle,
      faClipboardList,
      faClipboardCheck,
      faCodeBranch,
      faCog,
      faDownload,
      faEdit,
      faEllipsisV,
      faEnvelope,
      faEquals,
      faExclamationCircle,
      faExclamationTriangle,
      faExpand,
      faEye,
      faFileAlt,
      faFileContract,
      faFileExcel,
      faFileImage,
      faFileInvoiceDollar,
      faFilePdf,
      faFilter,
      faFlag,
      faGraduationCap,
      faHome,
      faHourglassEnd,
      faHistory,
      faImage,
      faInbox,
      faInfoCircle,
      faLandmark,
      faLink,
      faLock,
      faPhone,
      faStar,
      faUnlink,
      faExternalLinkAlt,
      faMapMarkedAlt,
      faMapMarkerAlt,
      faMoneyBillAlt,
      faMoneyCheckAlt,
      faNotesMedical,
      faPassport,
      faPencilAlt,
      faPlus,
      faPlusCircle,
      faPlusSquare,
      faPrint,
      faQuestionCircle,
      faReceipt,
      faSave,
      faSearch,
      faSignOutAlt,
      faSitemap,
      faSlidersH,
      faSort,
      faSortAmountDown,
      faSortAmountUp,
      faSortDown,
      faSortUp,
      faSpinner,
      faStethoscope,
      faStopwatch,
      faSuitcase,
      faSync,
      faTable,
      faTasks,
      faTimes,
      faTimesCircle,
      faTrash,
      fasTrashAlt,
      farTrashAlt,
      faUniversity,
      faUpload,
      faUser,
      faUserCircle,
      faUserClock,
      faUserCog,
      faUserInjured,
      faUserShield,
      faUsers,
      faUndo,
      faClock,
      faList,
      faExchangeAlt,
      faTimesCircleRegular,
      faUmbrella,
      faHandHoldingHeart,
      faCalendarDay,
      faListUl,
      faHandHoldingUsd,
      faWallet,
      faUserTie,
      faCheckSquare
    );
  }
}
