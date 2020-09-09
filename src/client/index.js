import { handleSubmit } from './js/formHandler';
import { updateUI } from './js/updateUI';
import { saveFunc } from './js/updateUI.js';
import { getSavedTrip } from './js/updateUI.js';
import { findZip } from './js/formHandler';
import { setMinDate } from './js/formHandler';

import './styles/resets.scss'
import './styles/base.scss'
import './styles/form.scss'
import './styles/footer.scss'
import './styles/header.scss'

export {
    handleSubmit,
    findZip,
    updateUI,
    saveFunc,
    getSavedTrip,
    setMinDate
}
