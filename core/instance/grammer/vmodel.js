import { setObjVal } from "../../util/handleObjVal.js"

export function vmodel(vm, elem, dataStr) {
  elem.oninput = function (e) {
    setObjVal(vm._data, dataStr, e.target.value);
  }
}
