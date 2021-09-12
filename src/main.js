import Vue from 'vue'
import App from './App.vue'

import {library} from "@fortawesome/fontawesome-svg-core";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

library.add(faExclamationTriangle)

import './tailwind.css'

Vue.config.productionTip = false

Vue.component("FaIcon", FontAwesomeIcon)

new Vue({
    render: h => h(App),
}).$mount('#app')
