const sys = require('./sys.js');
const xt = require('./xt');

/**
 * @param {Socket} socket
 * @param {string} msg
 */
module.exports.execute = function (socket, msg) {
    let xml = stringToXml(msg);
    if (xml === 'ERROR') return;
    let _msg = xml.msg;
    let type = _msg.$?.t;
    if (type === "xt") {
        xtHandleMessage(socket, _msg)
    } else if (type === "sys") {
        sys.onResponse(socket, _msg);
    }
}

/**
 * @param {Socket} socket
 * @param {Object} msgObj
 */
function xtHandleMessage(socket, msgObj) {
    console.log(msgObj);
    let action = msgObj.body["$"].action;
    //let id = msgObj.body["$"].id;
    if (action === "xtRes") {
        const body = msgObj.body.toString();
        const dataObject = ObjectSerializer.getInstance().deserialize(body);
        let event = {
            dataObj: dataObject, type: "xml",
        }
        xt.onResponse(socket, event);
    }
}

/**
 *
 * @param {string} xmlString
 */
function stringToXml(xmlString) {
    let xml = {};
    if (!xmlString.startsWith('<')) {
        return "ERROR";
    }
    xmlString = xmlString.substring(1);
    let objName = xmlString.split(">")[0];
    objName = objName.split(" ")[0];
    let startTag = xmlString.substring(0, xmlString.indexOf('>')).trim();
    if (startTag.endsWith('/')) startTag = startTag.substring(0, startTag.length - 1);
    let attributes = {};
    let withAttributes = false;
    if (startTag.length !== objName.length) {
        let attr = startTag.split(' ');
        for (let a = 1; a < attr.length; a++) {
            let att = attr[a].trim();
            if (att !== "" && att.indexOf('=') !== -1) {
                let attParts = att.split("=");
                let _attName = attParts[0].trim();
                attributes[_attName] = attParts[1].trim().replace(/'/g, "");
                withAttributes = true;
            }
        }
    }
    let endTag = `</${objName}>`;
    let endTagIndex = xmlString.indexOf(endTag);
    let objXml = {};
    if (withAttributes) {
        objXml.$ = attributes;
    }

    if (endTagIndex !== -1) {
        let xmlPart = xmlString.substring(xmlString.indexOf('>') + 1, endTagIndex).trim();
        if (xmlPart !== "") {
            let children = stringToXml(xmlPart);
            let _keys = Object.keys(children);
            for (let c = 0; c < _keys.length; c++) {
                let key = _keys[c];
                objXml[key] = children[key];
            }
        }
    } else {
        endTag = '/>';
        endTagIndex = xmlString.indexOf(endTag);
    }
    xml[objName] = objXml;

    xmlString = xmlString.substring(endTagIndex + endTag.length).trim();
    if (xmlString !== "") {
        let siblings = stringToXml(xmlString);
        let _keys = Object.keys(siblings);
        for (let c = 0; c < _keys.length; c++) {
            let key = _keys[c];
            xml[key] = siblings[key];
        }
    }
    return xml;
}