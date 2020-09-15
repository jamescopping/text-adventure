export class DomUtil {
    static xmlToObj(xml) {
        const nodeToObj = nodeArray => {

            const areAllNodeNamesSame = nodeNames => {
                if (nodeNames.length === 1) return true;
                for (let index = 1; index < nodeNames.length; index++) {
                    if (nodeNames[index - 1].nodeName !== nodeNames[index].nodeName) return false;
                }
                return true;
            }


            let obj = {};
            nodeArray.forEach(node => {
                let property = node.nodeName;
                if (node.children.length === 0) {
                    obj[property] = node.textContent;
                } else if (areAllNodeNamesSame(node.children)) {
                    let array = [];
                    [...node.children].forEach(element => {
                        if (element.children.length === 0) {
                            array.push(element.textContent);
                        } else {
                            array.push(nodeToObj([...element.children]));
                        }
                    });
                    obj[property] = [...array];
                } else {
                    obj[property] = nodeToObj([...node.children]);
                }
            });
            return obj;
        }

        return nodeToObj([...xml]);
    }
}