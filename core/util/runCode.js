
/** 将传入的envObj转换为变量声明代码字符串 */
export function generateCode(envObj) {
  let resCode = '';
  for (const prop in envObj) {
    resCode += `let ${prop} = ${JSON.stringify(envObj[prop])}; `
  }
  return resCode;
}

/** 根据传入envCode判断expression是否为true */
export function isTrue(expression, envCode) {
  let resBool = false
  const resCode = `${envCode} if(${expression}) { resBool = true }`
  eval(resCode);
  return resBool;
}
