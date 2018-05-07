var fs = require('fs')

function parseFormData(string){
  function proxit(obj) {
    return new Proxy(obj, {
      get(target, prop) {
        if (typeof prop == "string") {
          if (typeof target[prop] == "undefined") {
            target[prop] = {}
          }
          return proxit(target[prop])
        }
        return Reflect.get(...arguments)
      }
    })
  }
  
  var qs = require('querystring')
  var querystring = qs.parse(string)
  var orig = {}
  var prox = proxit(orig)

  Object.entries(querystring).forEach(([key, value]) => {
    eval(`prox.${key.replace(/\[(.*?)\]/g,(m,n) => `["${n}"]`)} = "${value}"`)
  })
  return orig
}



var data = fs.readFileSync("form.json","utf-8")
var parsed = parseFormData(data)
fs.writeFileSync("form.json",JSON.stringify(parsed,null,2))