import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret,
        faHome,
        faBars,
        faTimes,
        faVideo,
        faCartPlus,
        faSearch,
        faFilePdf,
        faPlus
                } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret,
            faHome,
            faBars,
            faTimes,
            faVideo,
            faCartPlus,
            faSearch,
            faFilePdf,
            faPlus
                )
Vue.component('font-awesome-icon', FontAwesomeIcon)