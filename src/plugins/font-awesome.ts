import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faCircleDown as fasCircleDown, 
  faRotate,
  faExpand,
  faCompress,
  faCog,
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faChevronUp, faChevronDown, faTriangleExclamation,
  faInfoCircle, faHandPointer, faHandPointDown,
  faFilePdf, faQrcode, faMusic, faPause, faLanguage 
} from '@fortawesome/free-solid-svg-icons'

import { faCircleDown as farCircleDown } from '@fortawesome/free-regular-svg-icons'
import { faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons'

library.add(
  fasCircleDown, 
  farCircleDown, 
  faWhatsapp, 
  faYoutube, 
  faRotate, 
  faFilePdf, 
  faQrcode, 
  faMusic, 
  faPause, 
  faLanguage,
  faExpand,
  faCompress,
  faCog,
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faChevronUp, 
  faChevronDown, 
  faTriangleExclamation,
  faInfoCircle,
  faHandPointer,
  faHandPointDown
)

export { FontAwesomeIcon }