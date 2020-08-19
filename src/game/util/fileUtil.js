export class FileUtil {
  static readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("text/plain");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
    };
    rawFile.send(null);
  }


  static readXMLFile(file) {
    let request;
    if (window.XMLHttpRequest) {
      request = new XMLHttpRequest();
    } else {    // IE 5/6
      request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    request.open("GET", file, false)
    request.setRequestHeader("Content-Type", "text/xml");
    request.send(null);
    return request.responseXML;
  }

  static toXML(string) {
    return new DOMParser().parseFromString(string, "text/xml");
  }
}
