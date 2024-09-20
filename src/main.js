/*
    Aug 2019
    @nimadez

    [ Code Map ]
    01. Preferences
    02. Camera
    03. Main Scene
    04. Axis View Scene
    05. Render Target
    06. HDRI and Skybox
    07. Light
    08. Material
    09. Builder
    10. Transformers
    11. Ghosts
    12. Palette
    13. Helper
    14. Symmetry
    15. Tool
    16. Tool Mesh
    17. Mesh Pool
    18. Snapshot
    19. Memory
    20. Projects
    21. UserInterface
    22. UserInterfaceAdvanced
    23. Initialize
    24. Events
    25. Events File
    26. Events Dom
    27. Utils
*/


import {
    engine,
    PositionKind, NormalKind, UVKind, ColorKind,
    DOUBLESIDE, FRONTSIDE, BACKSIDE,
    AXIS_X, AXIS_Y, AXIS_Z,
    Vector3, Color3, Color4,
    Vector3Distance, Vector3TransformCoordinates, isTargetIn,
    MatrixIdentity, MatrixTranslation, MatrixScaling,
    CreateBox, CreatePlane, CreateSphere, CreateLine,
    MergeMeshes, Animator,
    LoadAssetContainerAsyncFromData,
    ExportGLB, ExportGLTF, ExportOBJ, ExportSTL
} from './modules/babylon.js';

import * as modules from './modules/modules.js';


// -------------------------------------------------------
// Globals


const startTime = performance.now();

const ENVMAP = "assets/snow_field_2_puresky_1k.hdr";
const SNAPSHOT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAACWCAYAAAC7MJjkAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAABOWSURBVHhe7Z3Jbh1FF8dzbcfzfO17jYwiJQohIgIh8QJsWbBkxQYCQigSQkg8AM/BKhKKgoQEUliw5QVYZpuPjJ7teLqO5+//d7pCu13Vt3qqqu6ulqwodg9Vp351Tp1zamhc8peXgKMSaDhaLl8sL4FLHk4PgbMS8HA62zS+YB5Oz4CzEvBwOts0vmAeTs+AsxLwcDrbNL5gHk7PgLMS8HA62zS+YB5Oz4CzEvBwOts0vmAeTs+AsxLwcDrbNL5gHk7PgLMS8HA62zS+YB5Oz4CzEvBwOts0vmAeTs+AsxLwcDrbNL5gTsH58ccf983Ozl5Gsxz89ttvx7558pXATz/91PPw4cOBqampo59//vkw37fn/zarcH722We9ly9fHj88PBxG1YaOjo56RBX7+/uP8fvOyMjI1i+//LKbf9Xr8cZvvvlmeGNjgzIeaTQavaLWfX19J8fHx696e3s7KysrW3///feRaxKxBWfj9u3bo7u7u62BgYFe/JzJZX9//+yH18HBwRtZQZCH6O1L6O17+OWpa0J0sDyNTz/9dAgdu3V6etofLV9YtvwbFQFkvPLOO+/sQLueuFIf43DSdM/NzbXGxsZGVUKQQcqeDs26hX/XvMlX40NrNDQ0NAktOQno3mjK8BNCvlFIIdtdaNElV7SoUThhYjienEFvHtPpnVEhElA8twkBbrgiQJ16mLqHYLZarUmY8EnIWAqmKIsKUJj6HSiPFRfGpMbg5GB8eXm5hcqPnZycaH83KkQI/Rjj1C0P6HnkaZFu3Lgxid9OdAMz/OTW1ta5YVRPT88p4N7FUGvJtoXShiRr78cYcwwVnoVp7kv6LhmgMF2bCwsLL70GvXSJYN66dWsCnX4ijXwJaGSMTwu1Ajg3k7ZVnvcbgZPmBmPMNjTeSBKtGTdOEhr00aNHL//55x/nwyJ5Nlr4XbBIfS9evJiE1z2eBky+S2bioUj2YOWoPf/zTIuqhOK9puAcbTabM6jsBc8xSX29iT8vLXZ6RDGmkppymcwl2vMQDtXavXv3Xtt9C5cROL/77rtZgDmBscybOGbauqoAxfvWbY+R0tYpzXMcw2PcPaXj/Oi8X+V8QqYrOs8XcY8ROO/cuTMHIY7nVQGZIBlm+uOPPyjIWsRB8+zwol2i2pOe+4MHD17k1W5J31M4nAwfwQOklz4SLRzMxqVwAD4ad4urTAygy0mFULb7v/zyy1k4hLlYonDdo3By3Dk+Pr5oK6xkDU6COT8//0Y2BJPC2d7e1mZFNpBHLHQLpmhR+yUlu/Hbb79lR2fIKPdLBqdNp6hwOCnB77//vt3pdCbC0rx69eoF4RLMqIC6tYAM0MHBwc379+9Tg1bJxDdghZrI/EyljXh0k2XtzDoF8tVXX00j1DElgsMIK12amZm5ICtqTwzyz8XcugmUf48CykAyGnCzKqlOeuWjo6PTRZhy1XhTpIsxjrc2TDKiORmAhxlvilCSCs40mlMIVzYGxe+2MW7asBmr0+lccfcIMDl7K0nmJ+l3axtKYgbj2rVrrXAQnpqTkIavKJwcl/LSdZRkGpSpOAh+HZmkV0kbzPb9IsCOciRKSSYttyoIv7i4uGAzA2dEc1JYGC9xzMlJH2cTEggePMEzb11MkxO9V3jx0al0OpDKNCg09u7e3t76X3/99Xo+XgkukSvPkvnRqabCqWT6knHjdZ13FHWPMThVKUyZdqRWJZjhv1GIus6SIqC8g2ujDIBmzZUngUUmUzhdnfX19UWbWpN1MAYnP4bA8QDMLNOYF2KeQqAEEks13oAZZ/bjGkExBu3g+2suA5p2dlESIMW90RlJZ0C8BnPVhWGQUThZeWjQ/omJiRaEwKUZF644OHlzEqdJBagr8xWjlWdK8vHjx82inR9+VwYmIhx7GDotu9J5jcNJwXCgj8F2W5U1UmlO0ZhZAGWYCdceIFhybDZTA5aFViX3zE+0E6g0Jsa3yy5FNqzAKQB99uzZnEyDyjz5qIDzAPSDDz544cqaGWZ+0HG4EC3z5Jg4Ey8bY1JjwmJZnR4nK7M1OLtp0KIBDcZX+wD0qW1Ai0xJhhtd5fy4pjFFma3CyUKIiSEwtcPhtJwINUVjoXlqUL6LkxssxvMaAHMWdecs9kLbQgUmQmwrrowxo21bqEDizEv4b3SS2u32DNdWRxuJk0NESEn1viwmnu+0YdYYWsME7KYNU85xN346CK2tugrmmWXTBajo+7744otB5o9lgOZt4mWLukw2FsNFmPgyVWSuXLRXVGMKMPF3Btm5D4CzlzNwUkIEFBe1yVDYMQhnk+K06OrqqvaUO1mjMdVZdBzUdBwznFUTkQqMMbn232kwndKcovsSUAhxGpAOywAtcgwaNN4OgtBcF597Lt5UrpyyLLPGdMYhktkUlYnX1aAcg1KL6lyqXHzegOaxSlKnPgJM/htZ7sv9ppw35eE6OmXWwwUTqU6VFx/OvcsaLYmJl81mynMMSlP+/vvvT+E7hU57U4HJlKTLXrmq0zkLJwtMLx4OLVdunsvF62hQag1Cl1aDip0vso5BTc3HrBqYTo45o71IlerUiYMmXZck06AZU51ncUwb4aKzxnVkdpHucCR6n9OaUxQ2DtBueXi+I8sYVHi4aaaQ2UxJEkxXMz+6sJYCTlYmC6BJNagsm8JM0s2bN5/rpjoJps3MT9nBLIVZD/cyAajMSdLRoEmcJEW6bx8a9HmXSbiNr7/+mlMCz6021dUWSe6ThYs4DEHSghvtln7/qNJoTtFowklKA2geGpTmUjXdjvMx19bWmvjOpOlceWj44cRE4SSdrJTeuqrQDDMBziYAuBCoL1qDCgiioRmGi2D2p4t2fmRrfkRKEsuq14pIHuQBWpp3lE5zikrGZZK6AZpVg0bCTAfQmL3chhBlM75KMtjtmanIUgXYdWAtLZysHDUoNMk0GmgkTaozyxg0lKfuYBdCnrgwXOS6cpXG5HyA6enp9bt37+aebtUBqMh7Sg2nAJQmPjqbqYg4aNQBiS5hLqqh4kw5TsxYqyKYpfPW48ag1KBwVkbTTFhOo0Ftgkk58OQL1+djZu2spdecUS9eleqMm82UdAxKTSY2fMjaAHHPyzTmmUapQIBdR26VgZOVVe0F2m25MZ9NCqiOcLPcU3cwK2PWwxBwogWWfLTRuOcO4SoToHFgpkmjZukkNp+tlOYMmXiuz5mTmfi8w0x5N57XmP9JtJJwsnpMdT558uTcznb8vcsaNM4rR7hquQopySSdubJwhsegaVOdaTayTSL88L0qMJkrr8IkjjRyqTScFEhcoL6biU+y5DiN8MUzcQH2su4tmkUe4tnKwykAxfHZTdmiOR1AdWfTp2mQmP0x96ocYNeRVS3gzKJBk0xU1hF4N1POXDmA7VQ1JZlERrWBMwyoLJNEDSocJiHAImOfdcyVJwGT99YKTgGoKhfPrE8486O7k3JSocc5P65s3Jq0TkXcXzs4KUROWEY6cwZe8LlAvRAww006+8+naRBVHJO5cryPx0hbO6U3TX2KfKaWcFKgccceFiXwuAB7VZZW5Cm72sIpAIWJv5qnQOPeJRsm8Nz4p0+fPnFsl2VTIon9Tq3h5Jqf58+fXzfVEio4P/zww//pruo0VVYXvlNbOIPjVOYxtuQsdiNXjFnf/v3333mYbJXO6sws01rCyfEmHBCeAT+UWYIJXxDjEG3dunVr2WvQ/wRaOziZzsTKyVl46kNFL99VcRsTSuL2iyu2D6dK2N8Ku71WcIolxbLdkwuTsOLFMUH4LYyD172DVKMgvFhKHD4c1jSQ0e+p8ur4/TYO8lqv2xS5qHxqoTnFdt7RqXO24eT3YyZ+7ODPXIte26B85eF0UWPqatCjo6MtOG4v6wpopeFU7Y7sgsbUBRT37Tx69GitjmPQysKp2vDLRTBFmeLGoAjgcx+kI5fLn3fZKgknA+zvvffeW1jgNmgrXJS2oXyYqcJxTqYksanW23B+BtMCYvu5OEDrlEmqlOa0kZLUATl6sJfOdDyf6qxQnJMpSYDyVtEaUxxNOD4+3pVL1WZiugvn4gDFacdLVU91VkJz0vmZmJjgVtfDXYnJcEN4VpEAL+513J+J53bKrqyAIsS0haXL3MW4sk5S6eE0lSuXTXfrBmgcnAQ2C6DBbsbbVQ4zlRpOUwF2GZjBjsIHWHN0iJ9+/L8/GhkgnDT/cYfJZgE0WKlZ2VRnaeH84YcfhjC7aLrolKQMzMgBrvsY73KG07RsppMJQBmox7Xh8tnpaUZTpYTTVK48ei47BUwwMXlkd3Nzcy0MAwAdhiZrRmOrYpNZHQ1KB4iaNO6qUy6+dHAGE4UJwViRAXYZmIQG392BGV+V5bvhmA1h/ftMdBKzLqC66+TrAmip4OTem/DKZ2DKx6DBetKYCp1nVGBy+W633d6o1bGNTDu6/MMkoFXx4ksDJzM/i4uLM0Wf8xMHJhp9SSd0E0w4Yfq0P9wZTAGKTrS9sLBQ+lx8WeBs3Llzp23ClMuyNzDjO/j2Ekz5sY7m5T3BUYhvRwHl33ScpCwmXjhswdaJ2mXWrZup+0oBJ8aZzPyMFSkU1dYzwU4ci0nAFOXsBqgqQC+ezwIo34GkBFd1LhQptyLf7TScNOXLy8stOBjdc4UZpKQKF/EAKiyXWMmyXCLYH7QNUAaiDhzh5N5McXHQPAAtqwZ1Fk46P/B8Z22YchEuwrelXnnSfkAnCQAyvWoN0DKu6nQSToaLgqD2eNHhougYk1kXQLmLAP96nkFtJg0Qw2ymDdRn0aAi1YlIw1oWK5C0U2a93zk4BZgmwkWmwBSNxEB9lkxSFkCDdGupFs05BSdnF8GST/MMoaLjmKbBFIDa1KBFWYWsGlL1vDNwBmt+Jun8mAZThF7yNuUqobugQcuQi3cCTmHKAclokcdCq3Ll+G7H9CGn1KA4RGE26iSZCtSj4+y4Pga1Didjgc+ePWuiUcbCZ6bnbSricuVZw0Vpyyq8+OjsfQ/oa4lahZNrfq5fv24ETFXmBynRZZ2UZFoAuz3HOCicpDnZVoxFZ5KEk+TqhGWbcDZgzueiJ1t0a8ykf1dlfpiS/PXXX5k9sb4nJjvpzZs3raU6mWyAPBKlZ5O2Q5r7rcFpMyWZJleeRrhJnolLdeZ5XmeZVnUahzNYV962kSunV04tAW1q1ZTHePFnK0hlmSQTgLrWaY3CGezEwcm4hebKZTPKRYwPGZo1lzfGopM0PDzMtO2F3UpMAMrJIq4sOzYGp5jEUXSuXAUmQyf4KcWWgnHLUIoGlNYF39h49913122vizcGJ+ZjMobZwrZ+fUnGYknuLbPGjNaTgELb8yCvC9uD5wmoLMTG42cQQVh+8OBB/IKmJI2T4l4jcNKc37hxgwHn0aImcsSBaSrzk0L+sY+YyCTF7ctke6qdEThv3749ht7ORWnnli3k1ZiqBV+cXeT6GLObDLhoDuumpLOZ8tKginX5hygbjzvkcMjKZQROaIAZmCjmzXNflBbX88uqMaMkMNWJ4VATgfoLJj6PQH3Mas5NwLlihUxTGSKMN3nmT+4euipmx+W7OJFipUq7AYttd2T7QelqUCzQUx44K9Oetpd5FK45g+wHF6eN5NkDVWAyVmc7JZlnPcPv4sytVqv1lizVqQPo6uqqctMGGZzwD/ba7fairQnKhcNZxOm8qp0xgp5e6WP64vYg7QYo5xfAokj7jgxOdPS9YNWplRM9CoeTksjTrKvAdClXXpTmFO8N1vBfkTmYcYAmhZPDI4STXhRdH9X7jcD5448/trB+ZiJrGEkGZmhTrVodyyfO79TNJBHMJGPOINW7BTiXKg3n559/Pj40NNSE2WXuONUVF8d8/PjxapWcH10BBctaOJ6Xpjq5eRiXHlN2qtlZ/JZs/I62OgrCcJu65cn7PiOa85NPPhmYn59nED7VzsNVDLDn1ZCMg2KytDTMpPsNhae+D7iX7t69+0r3PXnfZwROFhrpuEkG4pMuw6hCrjzvRou+L8uWkLL0JSfJ8OS4+/fvrxZd9rj3G4NThJSSbPbqNaY+GnGZJNVbVEtXGEKCIuHkYyteuiivMTgD7Xk2mUHHvNdlD0p9/LrfSUBxTcOZGcYGt8q2FbLlG6PLVzBGPcDCu+U///yz0/2Lxd5hFE4BKOcrRjdYDVdTlZKE0DlLphTT3optNvXbaeKR6pzCHSNiibVwioTzI4OSv4Pi4PiS8t3Fv9aXrxiHk0Kgl4nB9ihMx2R4Cp2qRwvPEaGQXZuL0WwBl/S7H3300eVr165xV74JAHouQiJb6BeMMbdf4spzC56k5Y7ebwVOFoKB5H///bcf4FGIg1g3PsCeLoQXzFx/hfHPDkxUB72Zs2Ss9+asAjf1POWLjtx/5cqVEciWc2kHot+GjA/x08HPzitcabZ5LLI+1uAUlaIQHz582IBWbCBQ/6Y8mG1ziq1pTiGwEw9legQCSHsgyx7I9A2gkPURZH4IR/UE97DTO9fxrcOZXuz+yapLwMNZ9RYucf08nCVuvKoX3cNZ9RYucf08nCVuvKoX3cNZ9RYucf08nCVuvKoX3cNZ9RYucf08nCVuvKoX3cNZ9RYucf08nCVuvKoX3cNZ9RYucf08nCVuvKoX3cNZ9RYucf08nCVuvKoX3cNZ9RYucf08nCVuvKoX3cNZ9RYucf3+D+lpg6UUlWb7AAAAAElFTkSuQmCC";
const TEX_PATTERNS = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4ODg4NzQ1MjgxNEExMUVEQjVDQTlGMzY0ODY0NzdERiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4ODg4NzQ1MzgxNEExMUVEQjVDQTlGMzY0ODY0NzdERiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg4ODg3NDUwODE0QTExRURCNUNBOUYzNjQ4NjQ3N0RGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg4ODg3NDUxODE0QTExRURCNUNBOUYzNjQ4NjQ3N0RGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+xCfx0wAAAAZQTFRF////AAAAVcLTfgAAAA5JREFUeNpiYAABgAADAAAGAAHgQhFOAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkU4REU5Qjk4OTRDMTFFRTg2QjBFRjM0QzQ0QkI4QkMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkU4REU5Qjg4OTRDMTFFRTg2QjBFRjM0QzQ0QkI4QkMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmRmOTNkMWFjLTRiNmMtYjQ0Yi04M2FiLTEyMTUwYjliNWIzYyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7JL+VyAAAABlBMVEXu7u7///8o06qaAAABNUlEQVR42uzQAQEAAAgCIPt/ugUuECaQAMy7SQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBDQAgBGvQADACdQ7GV7QTbFAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzUzQjBCN0M4OTRDMTFFRTg4NDlFNEZFOTAyNkI3NUUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzUzQjBCN0I4OTRDMTFFRTg4NDlFNEZFOTAyNkI3NUUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmRmOTNkMWFjLTRiNmMtYjQ0Yi04M2FiLTEyMTUwYjliNWIzYyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7S7fDaAAAABlBMVEXu7u7///8o06qaAAABP0lEQVR42uzdMQ0AAAgDQfBvmgkNJeHeQJNbGKmSpPd1puT2zgMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArgFIku/zziAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAkCSnjYCDAD0EOLiNtloaAAAAABJRU5ErkJggg==",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0I0Q0RBQzE4OTRDMTFFRTlDRDBFNzEwQzg2ODU2M0IiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0I0Q0RBQzA4OTRDMTFFRTlDRDBFNzEwQzg2ODU2M0IiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmRmOTNkMWFjLTRiNmMtYjQ0Yi04M2FiLTEyMTUwYjliNWIzYyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7DbGeBAAAACVBMVEXu7u719fX////A386gAAABQElEQVR42uzUwQkAQAgDQb3+ixauiQjONhCYR6ok6Xyd6W+/WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAlQCSdLrkDXcsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYCeAJB1tBBgACnlUY660frcAAAAASUVORK5CYII=",
];

const COL_ORANGE = '#FFA500';
const COL_ORANGE_RGB = color3FromHex(COL_ORANGE);
const COL_ORANGE_RGBA = color4FromHex(COL_ORANGE + 'FF');
const COL_AQUA = '#00FFFF';
const COL_AQUA_RGB = color3FromHex(COL_AQUA);
const COL_AQUA_RGBA = color4FromHex(COL_AQUA + 'FF');
const COL_AXIS_X = '#ED3751';
const COL_AXIS_X_RGB = color3FromHex(COL_AXIS_X);
const COL_AXIS_X_RGBA = color4FromHex(COL_AXIS_X + 'FF');
const COL_AXIS_Y = '#81C90F';
const COL_AXIS_Y_RGB = color3FromHex(COL_AXIS_Y);
const COL_AXIS_Y_RGBA = color4FromHex(COL_AXIS_Y + 'FF');
const COL_AXIS_Z = '#2F85E6';
const COL_AXIS_Z_RGB = color3FromHex(COL_AXIS_Z);
const COL_AXIS_Z_RGBA = color4FromHex(COL_AXIS_Z + 'FF');
export const COL_ICE = '#8398AF';
const COL_RED = '#FF0000';
const COL_CLEAR_RGBA = Color4(0, 0, 0, 0);

const PI2 = Math.PI * 2;
const PIH = Math.PI / 2;
const VEC3_TWO = Vector3(2, 2, 2);
const VEC6_ONE = [
    Vector3(1, 0, 0),
    Vector3(-1, 0, 0),
    Vector3(0, 1, 0),
    Vector3(0, -1, 0),
    Vector3(0, 0, 1),
    Vector3(0, 0, -1)
];

const MAX_VOXELS = 512000;
const MAX_VOXELS_DRAW = 64000;
const WORKPLANE_SIZE = 120;
const WORKPLANE_VISIBILITY = 0.15;
const RECYCLEBIN = Vector3(-2000000, -2000000, -2000000);
const DEF_BGCOLOR = document.getElementById('input-env-background').value.toUpperCase();
const DEF_LIGHTCOLOR = document.getElementById('input-light-color').value.toUpperCase();
const isMobile = isMobileDevice();

const canvas = document.getElementById('canvas');

export let MODE = 0; // model|render|export
const FPS_TOOL = 1000 / 30;
let isRenderAxisView = true;
let currentColor = document.getElementById('input-color').value.toUpperCase();
let currentColorBake = document.getElementById('input-material-albedo').value.toUpperCase();
let duplicateFlag = 0;

const workplaneWhiteList = [
    'add',
    'box_add', 'box_remove', 'box_paint',
    'transform_box', 'transform_rect',
    'rect_add', 'rect_remove', 'rect_paint',
    'measure_volume', 'frame_voxels'
];

const bvhWhiteList = [
    'rect_add'
];


// -------------------------------------------------------
// Preferences


const KEY_STARTUP = "pref_startup";
const KEY_NOHOVER = "pref_nohover";
const KEY_PALETTE_SIZE = "pref_palette_size";
const KEY_FLOORPLANE = "pref_floorplane";
const KEY_POINTCLOUD = "pref_pointcloud";
const KEY_WEBSOCKET = "pref_websocket";
const KEY_WEBSOCKET_URL = "pref_websocket_url";

class Preferences {
    constructor() {
        this.isInitialized = false;
    }

    init() {
        document.getElementById(KEY_STARTUP).checked = false;
        document.getElementById(KEY_NOHOVER).checked = false;
        document.getElementById(KEY_PALETTE_SIZE).value = 1;
        document.getElementById(KEY_FLOORPLANE).checked = true;
        document.getElementById(KEY_POINTCLOUD).checked = true;
        document.getElementById(KEY_WEBSOCKET).checked = false;
        document.getElementById(KEY_WEBSOCKET_URL).value = "localhost:8014";

        this.initPrefCheck(KEY_STARTUP);

        this.initPrefCheck(KEY_NOHOVER, (chk) => {
            this.setNoHover(chk);
        });

        this.initPref(KEY_PALETTE_SIZE, (val) => {
            palette.expand(val);
        });

        this.initPrefCheck(KEY_FLOORPLANE, (chk) => {
            helper.floorPlane.isVisible = chk;
        });

        this.initPrefCheck(KEY_POINTCLOUD, (chk) => {
            (chk && MODE == 2) ? ghosts.createPointCloud() : ghosts.disposePointCloud();
        });

        this.initPrefCheck(KEY_WEBSOCKET, (chk) => {
            (chk && !modules.sandbox.isActive()) ? modules.ws_client.connect() : modules.ws_client.disconnect();
        });

        this.initPref(KEY_WEBSOCKET_URL);
    }

    finish() {
        console.log('load preferences');

        hdri.preload(() => {
            if (this.getStartup()) {
                project.loadFromUrl('user/startup.json', () => {
                    this.postFinish();
                    ui.hideInterface(false);
                    document.getElementById('introscreen').style.display = 'none';
                    console.log(`startup: ${(performance.now()-startTime).toFixed(2)} ms`);
                    
                });
            } else {
                project.newProjectStartup();
                this.postFinish();
                ui.hideInterface(false);
                document.getElementById('introscreen').style.display = 'none';
                console.log(`startup: ${(performance.now()-startTime).toFixed(2)} ms`);
            }

            ui.toggleHover(!this.getNoHover());
            palette.expand(this.getPaletteSize());
            helper.floorPlane.isVisible = this.getFloorPlane();
        });
    }

    postFinish() {
        // inject extra babylon libs
        const scriptSerializers = document.createElement('script');
        scriptSerializers.src = 'libs/babylonjs.serializers.min.js';
        document.body.appendChild(scriptSerializers);
        const scriptInspector = document.createElement('script');
        scriptInspector.src = 'libs/babylon.inspector.bundle.js';
        document.body.appendChild(scriptInspector);

        console.log(`mobile device: ${isMobile}`);
        console.log(`webgpu capability: ${ navigator.gpu !== undefined }`);
        console.log('done');
        this.isInitialized = true;

        // inject the user module entry point
        const scriptUserModules = document.createElement('script');
        scriptUserModules.type = 'module';
        scriptUserModules.src = 'user/user.js';
        document.body.appendChild(scriptUserModules);
    }

    setStartup(isEnabled) {
        localStorage.setItem(KEY_STARTUP, isEnabled);
    }

    getStartup() {
        return document.getElementById(KEY_STARTUP).checked;
    }

    getNoHover() {
        return document.getElementById(KEY_NOHOVER).checked;
    }

    setNoHover(isEnabled) {
        document.getElementById(KEY_NOHOVER).checked = isEnabled;
        localStorage.setItem(KEY_NOHOVER, isEnabled);
        ui.toggleHover(!isEnabled);
    }

    getPaletteSize() {
        return document.getElementById(KEY_PALETTE_SIZE).value;
    }

    setFloorPlane(isEnabled) {
        localStorage.setItem(KEY_FLOORPLANE, isEnabled);
    }

    getFloorPlane() {
        return document.getElementById(KEY_FLOORPLANE).checked;
    }

    setPointCloud(isEnabled) {
        localStorage.setItem(KEY_POINTCLOUD, isEnabled);
    }

    getPointCloud() {
        return document.getElementById(KEY_POINTCLOUD).checked;
    }

    getWebsocket() {
        return document.getElementById(KEY_WEBSOCKET).checked;
    }

    getWebsocketUrl() {
        return document.getElementById(KEY_WEBSOCKET_URL).value;
    }

    initPref(key, callback = undefined) {
        if (localStorage.getItem(key))
            document.getElementById(key).value = localStorage.getItem(key);

        document.getElementById(key).addEventListener("input", (ev) => {
            localStorage.setItem(key, ev.target.value);
            if (callback) callback(ev.target.value);
        }, false);
    }

    initPrefCheck(key, callback = undefined) {
        if (localStorage.getItem(key))
            document.getElementById(key).checked = parseBool(localStorage.getItem(key));
        
        document.getElementById(key).addEventListener("input", (ev) => {
            localStorage.setItem(key, ev.target.checked);
            if (callback) callback(ev.target.checked);
        }, false);
    }
}


// -------------------------------------------------------
// Camera


class Camera {
    constructor() {
        this.camera0 = null;
        this.lastPos = [];
    }

    init(scene) {
        this.camera0 = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, Vector3(0, 0, 0), scene);

        this.camera0.setPosition(Vector3(100, 100, 100));
        this.camera0.setTarget(Vector3(0, 0, 0));
        this.camera0.lowerRadiusLimit = 2;
        this.camera0.upperRadiusLimit = 1500;
        this.camera0.lowerBetaLimit = 0.0001;   // fix ortho Y inaccuracy
        this.camera0.upperBetaLimit = Math.PI - 0.0001;
        this.camera0.wheelPrecision = 3;        // def 3
        this.camera0.pinchPrecision = 30;       // def 12
        this.camera0.panningSensibility = 200;  // def 1000
        this.camera0.inertia = 0.9;             // def 0.9
        //this.camera0.minZ = 0.01;
        //this.camera0.maxZ = 2000;
        this.camera0.fov = parseFloat(document.getElementById('input-camera-fov').value); //def: 0.8
        
        this.camera0.attachControl(canvas, true);
    }

    frame() {
        if (MODE == 0) {
            (xformer.isActive) ?
                camera.setFramingBehavior(camera.camera0, ghosts.thin) :
                this.setFramingBehavior(this.camera0, builder.mesh);
        } else if (MODE == 1) {
            modules.sandbox.frameCamera();
        } else if (MODE == 2) {
            if (pool.meshes.length > 0) {
                if (pool.selected) {
                    this.setFramingBehavior(this.camera0, pool.selected);
                } else {
                    this.setFramingBehavior(this.camera0, builder.mesh);
                }
            } else {
                this.setFramingBehavior(this.camera0, builder.mesh);
            }
        }
    }

    frameColor(hex) {
        ghosts.createThin(builder.getVoxelsByColor(hex));
        this.setFramingBehavior(this.camera0, ghosts.thin);
        ghosts.disposeThin();
    }

    frameVoxels(voxels) {
        ghosts.createThin(voxels);
        this.setFramingBehavior(this.camera0, ghosts.thin);
        ghosts.disposeThin();
    }

    setFramingBehavior(cam, mesh) {
        const f = this.getFramed(mesh);
        if (f) {
            Animator(cam, 'radius', cam.radius, f.radius);
            Animator(cam, 'target', cam.target.clone(), f.target);
        }
    }

    getFramed(mesh, offset = 1.5) {
        if (!mesh) return undefined;

        mesh.computeWorldMatrix(true);
        const bounds = mesh.getBoundingInfo();
        const { minimumWorld, maximumWorld } = bounds.boundingBox;

        const frustumSlopeY = Math.tan(scene.activeCamera.fov / 2);
        const frustumSlopeX = frustumSlopeY * scene.getEngine().getAspectRatio(scene.activeCamera);
        
        // TODO
        const radiusWithoutFraming = Vector3Distance(minimumWorld, maximumWorld) * 0.5;
        if (radiusWithoutFraming < 10) offset = 2.5;
        if (radiusWithoutFraming > 10) offset = 2.0;
        if (radiusWithoutFraming > 20) offset = 1.5;
        if (radiusWithoutFraming > 30) offset = 1.1;

        const radius = radiusWithoutFraming * offset;
        const distanceForHorizontalFrustum = radius / frustumSlopeX;
        const distanceForVerticalFrustum = radius / frustumSlopeY;
        const distance = offset + Math.max(distanceForHorizontalFrustum, distanceForVerticalFrustum);

        return { radius: distance, target: bounds.boundingSphere.centerWorld };
    }

    toggleCameraAutoRotation() {
        scene.activeCamera.useAutoRotationBehavior = !scene.activeCamera.useAutoRotationBehavior;
        if (scene.activeCamera.useAutoRotationBehavior) {
            (ui.domAutoRotationCCW.checked) ?
                scene.activeCamera.autoRotationBehavior.idleRotationSpeed = -0.1 : // CCW
                scene.activeCamera.autoRotationBehavior.idleRotationSpeed = 0.1;   // CW
            scene.activeCamera.autoRotationBehavior.idleRotationWaitTime = 1;
            scene.activeCamera.autoRotationBehavior.idleRotationSpinupTime = 1;
        }
        ui.domAutoRotation.checked = scene.activeCamera.useAutoRotationBehavior;
    }

    updateCameraAutoRotation() {
        if (scene.activeCamera.useAutoRotationBehavior) {
            (ui.domAutoRotationCCW.checked) ?
                scene.activeCamera.autoRotationBehavior.idleRotationSpeed = -0.1 :
                scene.activeCamera.autoRotationBehavior.idleRotationSpeed = 0.1;
        }
    }

    switchOrtho() {
        if (scene.activeCamera.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
            this.setView('persp');
            ui.domInScreenOrtho.innerHTML = 'P';
        } else {
            this.setView('ortho');
            ui.domInScreenOrtho.innerHTML = 'O';
        }
    }

    setView(name) {
        const center = builder.getCenter();
        let position = null;

        switch (name) {
            case 'x':
                position = Vector3(1, 0, 0);
                break;
            case '-x':
                position = Vector3(-1, 0, 0);
                break;
            case 'y':
                position = Vector3(0, 1, 0);
                break;
            case '-y':
                position = Vector3(0, -1, 0);
                break;
            case 'z':
                position = Vector3(0, 0, 1);
                break;
            case '-z':
                position = Vector3(0, 0, -1);
                break;
            case 'ortho':
                scene.activeCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
                ui.domOrthoBtn.innerHTML = 'Orthographic';
                break;
            case 'persp':
                scene.activeCamera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
                ui.domOrthoBtn.innerHTML = 'Perspective';
                break;
        }

        if (position) {
            scene.activeCamera.setPosition(position.multiplyByFloats(
                scene.activeCamera.radius,
                scene.activeCamera.radius,
                scene.activeCamera.radius).add(center));
            scene.activeCamera.setTarget(center);
        }
    }

    setOrthoMode() {
        const sizeY = (scene.activeCamera.radius / 2) * scene.activeCamera.fov;
        const sizeX = sizeY * scene.getEngine().getAspectRatio(scene.activeCamera);
        scene.activeCamera.orthoLeft = -sizeX;
        scene.activeCamera.orthoRight = sizeX;
        scene.activeCamera.orthoTop = sizeY;
        scene.activeCamera.orthoBottom = -sizeY;
    }

    setFov(value) {
        scene.activeCamera.fov = parseFloat(value);
    }

    isCameraChange() {
        return (this.lastPos[0] !== this.camera0.alpha &&
                this.lastPos[1] !== this.camera0.beta &&
                this.camera0.hasMoved)
    }
}


// -------------------------------------------------------
// Main Scene


class MainScene {
    constructor() {}

    create() {
        const scene = new BABYLON.Scene(engine.engine);
        scene.clearColor = COL_CLEAR_RGBA;
        scene.autoClear = false;
        scene.autoClearDepthAndStencil = false;
        scene.blockMaterialDirtyMechanism = true;
        scene.collisionsEnabled = false;
        scene.useRightHandedSystem = true;
    
        const ambient = new BABYLON.HemisphericLight("ambient", Vector3(0, 0, -1), scene);
        ambient.diffuse = Color3(0.4, 0.4, 0.4);
        ambient.specular = Color3(0.2, 0.2, 0.2);
        ambient.groundColor = Color3(0.2, 0.2, 0.2);
        ambient.intensity = 0.4;
        
        const shadowcatcher = CreatePlane("shadowcatcher", 1000, BACKSIDE, scene);
        shadowcatcher.material = new BABYLON.ShadowOnlyMaterial('shadowcatcher', scene);
        shadowcatcher.material.shadowColor = color3FromHex('#0D1117');
        //shadowcatcher.material.activeLight = light.directional; // define later
        shadowcatcher.material.backFaceCulling = true;
        shadowcatcher.material.alpha = 0.1;
        shadowcatcher.position.y = -0.5;
        shadowcatcher.rotation.x = -PIH;
        shadowcatcher.receiveShadows = true;
        shadowcatcher.isPickable = false;
        shadowcatcher.doNotSyncBoundingInfo = true;
        shadowcatcher.doNotSerialize = true;
        shadowcatcher.freezeWorldMatrix();
        shadowcatcher.freezeNormals();
    
        camera.init(scene);
    
        return scene;
    }
}


// -------------------------------------------------------
// Axis View Scene


class AxisViewScene {
    constructor() {
        this.scene = undefined;
        this.viewCube = undefined;
        this.viewAxes = [];
        this.view = [ 100, 100, -5, -95 ];
        
        this.init();
    }

    predicate = (mesh) => {
        return this.viewAxes.includes(mesh) || mesh == this.viewCube;
    }

    init() {
        this.scene = new BABYLON.Scene(scene.getEngine());
        this.scene.clearColor = COL_CLEAR_RGBA;
        this.scene.autoClear = false;
        this.scene.autoClearDepthAndStencil = false;
        this.scene.blockMaterialDirtyMechanism = true;
        this.scene.collisionsEnabled = false;
        this.scene.useRightHandedSystem = true;

        const ambient = new BABYLON.HemisphericLight("ambient", Vector3(0, 0, -1), this.scene);
        ambient.diffuse = Color3(1, 1, 1);
        ambient.groundColor = Color3(1, 1, 1);
        ambient.intensity = 1;

        const cam = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, Vector3(0, 0, 0), this.scene);
        cam.viewport = this.getViewport(this.view[0], this.view[1], this.view[2], this.view[3]);
        cam.radius = 5.2;
        cam.fov = 0.5;
        cam.alpha = scene.activeCamera.alpha;
        cam.beta = scene.activeCamera.beta;

        this.viewCube = CreateBox("viewcube", 0.52, FRONTSIDE, this.scene);
        this.viewCube.material = new BABYLON.NormalMaterial("viewcube", this.scene);
        this.viewCube.material.backFaceCulling = true;
        this.viewCube.material.freeze();
        this.viewCube.doNotSyncBoundingInfo = true;
        this.viewCube.doNotSerialize = true;
        this.viewCube.freezeWorldMatrix();
        this.viewCube.freezeNormals();

        const axisHelper = new BABYLON.AxesViewer(this.scene, 0.65, 0, null,null,null, 6);
        axisHelper.xAxis.getScene().materials[1].emissiveColor = COL_AXIS_X_RGB;
        axisHelper.yAxis.getScene().materials[2].emissiveColor = COL_AXIS_Y_RGB;
        axisHelper.yAxis.getScene().materials[3].emissiveColor = COL_AXIS_Z_RGB;
        axisHelper.xAxis.parent = this.viewCube;
        axisHelper.yAxis.parent = this.viewCube;
        axisHelper.zAxis.parent = this.viewCube;

        const mat = new BABYLON.StandardMaterial("axisview", this.scene);
        const sphere = CreateSphere("viewaxes", 0.62, 6, FRONTSIDE, this.scene);
        this.viewAxes = [ sphere, sphere.clone(), sphere.clone(), sphere.clone(), sphere.clone(), sphere.clone() ];

        for (let i = 0; i < this.viewAxes.length; i++) {
            this.viewAxes[i].material = mat;
            this.viewAxes[i].renderOverlay = true;
            this.viewAxes[i].renderOutline = true;
            this.viewAxes[i].outlineWidth = 0.05;
            this.viewAxes[i].overlayAlpha = 1;
            this.viewAxes[i].doNotSyncBoundingInfo = true;
            this.viewAxes[i].doNotSerialize = true;
            this.viewAxes[i].freezeNormals();
        }

        this.viewAxes[0].position.x = 0.9;
        this.viewAxes[0].renderOutline = false;
        this.viewAxes[0].overlayColor = COL_AXIS_X_RGB;
        this.viewAxes[1].position.x = -0.9;
        this.viewAxes[1].scaling.scaleInPlace(-0.9); // exclude border size
        this.viewAxes[1].overlayAlpha = 0.3;
        this.viewAxes[1].visibility = 0.01;
        this.viewAxes[1].overlayColor = this.viewAxes[0].overlayColor;
        this.viewAxes[1].outlineColor = this.viewAxes[0].overlayColor;
        this.viewAxes[2].position.y = 0.9;
        this.viewAxes[2].renderOutline = false;
        this.viewAxes[2].overlayColor = COL_AXIS_Y_RGB;
        this.viewAxes[3].position.y = -0.9;
        this.viewAxes[3].scaling.scaleInPlace(-0.9);
        this.viewAxes[3].overlayAlpha = 0.3;
        this.viewAxes[3].visibility = 0.01;
        this.viewAxes[3].overlayColor = this.viewAxes[2].overlayColor;
        this.viewAxes[3].outlineColor = this.viewAxes[2].overlayColor;
        this.viewAxes[4].position.z = 0.9;
        this.viewAxes[4].renderOutline = false;
        this.viewAxes[4].overlayColor = COL_AXIS_Z_RGB;
        this.viewAxes[5].position.z = -0.9;
        this.viewAxes[5].scaling.scaleInPlace(-0.9);
        this.viewAxes[5].overlayAlpha = 0.3;
        this.viewAxes[5].visibility = 0.01;
        this.viewAxes[5].overlayColor = this.viewAxes[4].overlayColor;
        this.viewAxes[5].outlineColor = this.viewAxes[4].overlayColor;
    }

    updateViewport() {
        this.scene.activeCamera.viewport = this.getViewport(this.view[0], this.view[1], this.view[2], this.view[3]);
    }

    getViewport(w, h, bottom, right) {
        //return new BABYLON.Viewport(1 - (w + right) / canvas.width, 1 - (bottom + canvas.height) / canvas.height,   w / canvas.width, h / canvas.height);
        return new BABYLON.Viewport((w + right) / canvas.width, 1 - (bottom + canvas.height) / canvas.height,   w / canvas.width, h / canvas.height);
    }

    registerEvent() {
        const pick = this.scene.pick(scene.pointerX, scene.pointerY, this.predicate);
        if (pick && pick.hit) {
            if (pick.pickedMesh == this.viewCube) {
                camera.frame();
            } else {
                if (pick.pickedMesh == this.viewAxes[0]) camera.setView('x');
                else if (pick.pickedMesh == this.viewAxes[1]) camera.setView('-x');
                else if (pick.pickedMesh == this.viewAxes[2]) camera.setView('y');
                else if (pick.pickedMesh == this.viewAxes[3]) camera.setView('-y');
                else if (pick.pickedMesh == this.viewAxes[4]) camera.setView('z');
                else if (pick.pickedMesh == this.viewAxes[5]) camera.setView('-z');
                scene.activeCamera.detachControl(canvas);
                setTimeout(() => { // main scene picking rotation conflict
                    scene.activeCamera.attachControl(canvas, true);
                }, 100);
            }
            return true;
        }
        return false;
    }
}


// -------------------------------------------------------
// Render Target


class RenderTarget {
    constructor() {
        this.pickTexture = undefined;
        this.frameBuffer = undefined;
        this.pixels = undefined;
        this.pointer = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.pickTexture = new BABYLON.RenderTargetTexture('pickTexture', {
            useSRGBBuffer: false, width: engine.engine.getRenderWidth(), height: engine.engine.getRenderHeight() },
            scene, false, undefined, BABYLON.Constants.TEXTURETYPE_UNSIGNED_INT, false, BABYLON.Constants.TEXTURE_NEAREST_NEAREST);

        this.pickTexture.clearColor = COL_CLEAR_RGBA;
        scene.customRenderTargets.push(this.pickTexture);

        this.pickTexture.onBeforeRender = () => {
            if (engine.isRendering && MODE == 0 && tool.name !== 'camera')
                builder.mesh.thinInstanceSetBuffer("color", builder.rttColors, 4, true);
        }
        
        this.pickTexture.onAfterRender = () => {
            if (engine.isRendering && MODE == 0 && tool.name !== 'camera' && !ui.domDevMode.checked)
                builder.mesh.thinInstanceSetBuffer("color", builder.bufferColors, 4, true);
        }

        this.frameBuffer = engine.engine._gl.createFramebuffer();

        const w = engine.engine.getRenderWidth();
        const h = engine.engine.getRenderHeight();
        const bufferSize = engine.engine.isWebGPU ? (4 * w * h + 255) & ~255 : 4 * w * h;
        this.pixels = new Uint8Array(bufferSize);
    }

    read() {
        this.pointer.x = Math.round(scene.pointerX);
        this.pointer.y = engine.engine.getRenderHeight() - Math.round(scene.pointerY);
        this.readTexturePixels(engine.engine._gl, this.pickTexture._texture._hardwareTexture.underlyingResource, this.pointer.x, this.pointer.y, 1, 1);
        return `${this.pixels[0]}_${this.pixels[1]}_${this.pixels[2]}`;
    }
    
    readTexturePixels(gl, texture, x, y, w, h) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels);
    }

    numToColor(num) {
        return [ 
            (num & 0xff0000) >> 16,
            (num & 0x00ff00) >>  8,
            (num & 0x0000ff) >>  0
        ];
    }

    resize() {
        const w = engine.engine.getRenderWidth();
        const h = engine.engine.getRenderHeight();
        
        this.pickTexture.resize({ width: w, height: h });

        const bufferSize = engine.engine.isWebGPU ? (4 * w * h + 255) & ~255 : 4 * w * h;
        this.pixels = new Uint8Array(bufferSize);
    }
}


// -------------------------------------------------------
// HDRI and Skybox


class HDRI {
    constructor() {
        this.hdrMap = undefined;
        this.hdrMapRender = undefined;
        this.skybox = undefined;
        this.isLoaded = false;
    }

    preload(onLoad) { // HDRCubeTexture locks the thread, start with smaller texture size
        this.hdrMap = new BABYLON.HDRCubeTexture(ENVMAP, scene, 16, false, false, false, undefined, () => {
            this.createSkybox(this.hdrMap.clone(), parseFloat(ui.domHdriBlur.value));
            scene.environmentTexture = this.hdrMap;
            onLoad();
        });

        modules.sandbox.loadHDR(ENVMAP, (tex) => {
            this.hdrMapRender = tex;
        });
    }

    loadHDR(url) {
        if (this.hdrMap)
            this.hdrMap.dispose();

        url += `?${performance.now()}`;

        this.hdrMap = new BABYLON.HDRCubeTexture(url, scene, 256, false, false, false, undefined, () => {            
            this.showSkybox(ui.domHdriBackground.checked);

            if (this.skybox.material.reflectionTexture)
                this.skybox.material.reflectionTexture.dispose();
            this.skybox.material.reflectionTexture = this.hdrMap.clone();
            this.skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

            scene.environmentTexture = this.hdrMap;
            
            pool.updateReflectionTextures();
            this.isLoaded = true;
        });

        modules.sandbox.loadHDR(url, (tex) => {
            this.hdrMapRender = tex;
            if (modules.sandbox.isActive())
                modules.sandbox.updateHDR();
        });
    }

    unloadHDR() {
        this.loadHDR(ENVMAP);
    }

    createSkybox(tex, blur, dist = 10000) {
        this.skybox = CreateBox('skybox', dist, BACKSIDE, scene);
        this.skybox.material = new BABYLON.PBRMaterial("skybox", scene);
        this.skybox.material.reflectionTexture = tex;
        this.skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        this.skybox.material.microSurface = 1.0 - blur;
        this.skybox.material.disableLighting = true;
        this.skybox.material.twoSidedLighting = true;
        this.skybox.material.backFaceCulling = false;
        this.skybox.isVisible = false;
        this.skybox.isPickable = false;
        this.skybox.rotation.y = -PIH;
        this.skybox.infiniteDistance = true;
        this.skybox.ignoreCameraMaxZ = true;
        this.skybox.doNotSyncBoundingInfo = true;
        this.skybox.doNotSerialize = true;
        this.skybox.freezeWorldMatrix();
        this.skybox.freezeNormals();
    }

    showSkybox(isShow) {
        this.skybox.isVisible = isShow;
    }

    setBlurAmount(num) {
        this.skybox.material.microSurface = 1.0 - num;
    }
}


// -------------------------------------------------------
// Light


class Light {
    constructor() {
        this.location = Vector3(50, 100, 50);
        this.angle = 70;
        this.directional = null;

        this.init();
    }

    init() {
        this.directional = new BABYLON.DirectionalLight("directional", Vector3(0, 0, -1), scene);
        this.directional.autoUpdateExtends = true;  // enable REFRESHRATE_RENDER_ONCE
        this.directional.position.copyFrom(this.location);
        this.directional.diffuse = color3FromHex(document.getElementById('input-light-color').value);
        this.directional.intensity = document.getElementById('input-light-intensity').value;
        this.directional.shadowMaxZ = 2500;
        this.directional.shadowMinZ = -2500;
        this.directional.setDirectionToTarget(Vector3(0, 0, 0));
        this.setLightPositionByAngle(this.angle, this.location.x);
        scene.getNodeByName("shadowcatcher").material.activeLight = this.directional;

        const shadowGen = new BABYLON.ShadowGenerator(isMobile ? 256 : 1024, this.directional);
        shadowGen.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        shadowGen.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM;
        shadowGen.useExponentialShadowMap = true;       // def true
        shadowGen.usePercentageCloserFiltering = true;  // webgl2 only, fallback -> usePoissonSampling
        shadowGen.forceBackFacesOnly = false;
        shadowGen.bias = 0.00001; // def 0.00005
        shadowGen.setDarkness(0);
    }

    updateShadowMap() {
        this.directional.getShadowGenerator().getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
    }
    
    updateAngle(angle) {
        this.setLightPositionByAngle(angle, this.location.x);
        this.updateShadowMap();
        material.updateCelMaterial();
    }
    
    updateHeight(posY) {
        this.directional.position.y = posY;
        this.directional.setDirectionToTarget(Vector3(0, 0, 0));
        this.updateShadowMap();
        material.updateCelMaterial();
    }
    
    updateIntensity(value) {
        this.directional.intensity = value;
        material.updateCelMaterial();
    }
    
    updateColor(hex) {
        this.directional.diffuse = color3FromHex(hex).toLinearSpace();
        material.updateCelMaterial();
    }
    
    getDirection() {
        return this.directional.direction;
    }
    
    enableShadows(isEnabled) {
        scene.getNodeByName("shadowcatcher").isVisible = isEnabled;
        this.directional.shadowEnabled = isEnabled;
        if (MODE == 0)
            builder.create();
    }

    addMesh(mesh) {
        this.directional.getShadowGenerator().addShadowCaster(mesh);
    }

    setLightPositionByAngle(angle, dist) {
        scene.lights[1].position.x = Math.cos(angle * Math.PI / 180) * dist;
        scene.lights[1].position.z = Math.sin(angle * Math.PI / 180) * dist;
        scene.lights[1].setDirectionToTarget(Vector3(0, 0, 0));
    }
}


// -------------------------------------------------------
// Material


class Material {
    constructor() {
        this.mode = 'CEL';
        this.mat_cel = undefined;
        this.mat_pbr_vox = undefined;
        this.mat_pbr_msh = undefined;
        this.mat_floor = undefined;
        this.mat_workplane = undefined;
        this.mat_highlight = undefined;
        this.mat_white = undefined;
        this.tex_pbr = undefined;
        this.textures = [];
        this.texId = 0; // last PBR texture
        
        this.init();
    }

    init() {
        for (let i = 0; i < TEX_PATTERNS.length; i++)
            this.textures.push(this.createTexture('texpat'+i, TEX_PATTERNS[i], BABYLON.Texture.LINEAR_LINEAR_MIPLINEAR));

        this.texId = 3; // checker
        this.tex_pbr = this.textures[this.texId];

        this.createCELMaterial();
        this.createPBRMaterialVoxel();
        this.createPBRMaterial(true);
        this.createHighlightMaterial();

        this.createWorkplaneMaterial();
        this.createFloorMaterial();
        this.createWhiteMaterial();
    }

    createPBRMaterialVoxel() {
        const mat = new BABYLON.PBRMaterial("PBR_V", scene);
        mat.albedoColor = Color3(1, 1, 1);
        mat.albedoTexture = this.createVoxelTexture();
        mat.roughness = 1;
        mat.metallic = 0;
        mat.metallicF0Factor = 0;
        mat.backFaceCulling = true;
        mat.specularIntensity = 1;
        mat.directIntensity = 1;
        mat.environmentIntensity = 1;
        mat.brdf.useSphericalHarmonics = false;
        mat.brdf.useEnergyConservation = false;
        this.mat_pbr_vox = mat;
    }

    createPBRMaterial(backFaceCulling = true) {
        if (this.mat_pbr_msh) {
            this.mat_pbr_msh.albedoTexture.dispose();
            if (this.mat_pbr_msh.reflectionTexture)
                this.mat_pbr_msh.reflectionTexture.dispose();
            this.mat_pbr_msh.dispose();
        }
        const mat = new BABYLON.PBRMaterial("PBR", scene);
        mat.albedoColor = Color3(1, 1, 1);
        mat.albedoTexture = this.tex_pbr.clone();
        if (hdri.hdrMap) {
            mat.reflectionTexture = hdri.hdrMap.clone();
            mat.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
        }
        mat.roughness = 0.9;
        mat.metallic = 0.1;
        mat.metallicF0Factor = 0;
        mat.alpha = 1;
        mat.alphaCutOff = 0.5;
        mat.alphaMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
        mat.transparencyMode = 1;
        mat.useAlphaFromAlbedoTexture = true;
        mat.backFaceCulling = backFaceCulling;
        mat.specularIntensity = 1;
        mat.directIntensity = 1;
        mat.environmentIntensity = 1;
        this.mat_pbr_msh = mat;
    }

    createHighlightMaterial() {
        const mat = new BABYLON.StandardMaterial("highlight", scene);
        mat.diffuseColor = Color3(1, 1, 1); // overrided
        mat.specularColor = Color3(1, 1, 1);
        mat.emissiveColor = Color3(0.5, 0.5, 0.5);
        mat.useEmissiveAsIllumination = false;
        mat.linkEmissiveWithDiffuse = true;
        mat.backFaceCulling = true;
        mat.transparencyMode = 0;
        mat.checkReadyOnEveryCall = false;
        this.mat_highlight = mat;
    }

    createWorkplaneMaterial() {
        const mat = new BABYLON.GridMaterial("workplane", scene);
        mat.gridRatio = 1;
        mat.majorUnitFrequency = 20;
        mat.minorUnitVisibility = 0.5;
        mat.mainColor = Color3(0, 1, 1);
        mat.lineColor = Color3(0, 1, 1);
        mat.opacity = 0.8;
        mat.backFaceCulling = false;
        mat.freeze();
        this.mat_workplane = mat;
    }

    createFloorMaterial() {
        const mat = new BABYLON.GridMaterial("floor", scene);
        mat.gridRatio = 0; // overrided by setFloor()
        mat.majorUnitFrequency = 20;
        mat.minorUnitVisibility = 0.25;
        mat.mainColor = Color3(0.1, 0.1, 0.1);
        mat.lineColor = Color3(1, 1, 1);
        mat.backFaceCulling = true;
        this.mat_floor = mat;
    }

    createWhiteMaterial() {
        const mat = new BABYLON.StandardMaterial("white", scene);
        mat.disableLighting = true;
        mat.emissiveColor = Color3(1, 1, 1);
        mat.zOffset = -1;
        mat.freeze();
        this.mat_white = mat;
    }

    createVoxelTexture(size = 128) {
        const tex = new BABYLON.DynamicTexture('voxeltex', size, scene, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        const ctx = tex.getContext();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00000080';
        ctx.filter = 'blur(1px)';
        ctx.strokeRect(0, 0, size, size);
        tex.update();
        tex.hasAlpha = false;
        tex.getAlphaFromRGB = false;
        return tex;
    }

    createTexture(name, url, sampling = BABYLON.Texture.NEAREST_SAMPLINGMODE) {
        const tex = new BABYLON.Texture(url, scene, undefined, undefined, sampling);
        tex.name = name;
        tex.uScale = 1;
        tex.vScale = 1;
        tex.hasAlpha = true;
        tex.gammaSpace = true;
        tex.optimizeUVAllocation = true;
        return tex;
    }

    setPBRTexture(idx = 3) {
        this.texId = idx;
        this.tex_pbr = this.textures[idx];
        this.createPBRMaterial(ui.domBakeryBackface.checked);
    }

    switchMaterial() {
        if (this.mode == 'CEL') {
            this.mode = 'PBR';
            builder.mesh.material = this.mat_pbr_vox;
        } else if (this.mode == 'PBR') {
            this.mode = 'CEL';
            builder.mesh.material = this.mat_cel;
        }
        ui.domMaterialSwitch.innerHTML = this.mode;
    }

    getMaterial() {
        if (this.mode == 'CEL') {
            return this.mat_cel;
        } else if (this.mode == 'PBR') {
            return this.mat_pbr_vox;
        }
    }

    createCELMaterial() {
        BABYLON.Effect.ShadersStore['celVertexShader'] = `
        precision highp float;

        attribute vec3 position;
        attribute vec3 normal;
        attribute vec2 uv;
        attribute vec4 color;

        varying vec3 vPositionW;
        varying vec3 vNormalW;
        varying vec2 vUv;
        varying vec4 vColor;

        uniform mat4 viewProjection;

        #include<instancesDeclaration>

        void main() {
            #include<instancesVertex>
            
            vec4 worldPos = finalWorld * vec4(position, 1.0);
            gl_Position = viewProjection * worldPos;
            
            #include<vertexColorMixing>
            
            vPositionW = vec3(worldPos);
            vNormalW = normalize(vec3(finalWorld * vec4(normal, 0.0)));
            vUv = uv;
        }`;
        
        BABYLON.Effect.ShadersStore['celFragmentShader'] = `
        precision highp float;
        
        varying vec3 vPositionW;
        varying vec3 vNormalW;
        varying vec2 vUv;
        varying vec4 vColor;
        
        uniform vec3 uCamDir;
        uniform vec3 uLightPos;
        uniform vec3 uLightDir;
        uniform vec3 uLightCol;
        
        void main() {
            vec2 grid = abs(fract(vUv - 0.5) - 0.5) / fwidth(vUv);
            float line = min(grid.x, grid.y);
            line = 1.0 - min(line, 1.0);
        
            vec3 normal = normalize(vNormalW);
            vec3 viewDir = normalize(uCamDir);
            vec3 lightDir = normalize(uLightDir);

            float amb = clamp(1.0 + 0.5 * normal.y, 0.0, 1.0);
            float dif = max(0.0, dot(normal, lightDir));
            float inv = max(0.0, dot(normal, -lightDir));
            float spc = pow(max(0.0, dot(reflect(-lightDir, normal), viewDir)), 8.0);

            vec3 brdf = vec3(0);
            brdf += 0.5 * amb * vec3(1);
            brdf += 1.1 * dif * uLightCol;
            brdf += 0.5 * inv * vec3(1);
            brdf += 0.1 * spc * vec3(1);

            vec3 col = pow(vColor.rgb * vColor.rgb, vec3(0.4545));
            col = mix(col, vec3(0), line * 0.22);
            col *= brdf;
            col = pow(col, vec3(0.4545));
        
            gl_FragColor = vec4(col, 1.0);
        }`;
        
        this.mat_cel = new BABYLON.ShaderMaterial('CEL', scene, {
                vertex: "cel", fragment: "cel",
            }, {
                attributes: [ "position", "normal", "uv", "color" ],
                uniforms:   [ "world", "worldView", "worldViewProjection", "view", "projection", "viewProjection",
                              "uCamDir", "uLightPos", "uLightDir", "uLightCol" ],
                needAlphaBlending: false,
                needAlphaTesting: false
            });
            this.updateCelMaterial();
        }
        
        updateCelMaterial() {
            if (this.mat_cel) {
                this.mat_cel.setVector3("uCamDir", camera.camera0.getDirection(AXIS_Z));
                this.mat_cel.setVector3("uLightPos", light.directional.position);
                this.mat_cel.setVector3("uLightDir", light.directional.direction);
                this.mat_cel.setColor3("uLightCol", Color3(
                    (light.directional.diffuse.r * light.directional.diffuse.r) * (light.directional.intensity * light.directional.intensity),
                    (light.directional.diffuse.g * light.directional.diffuse.g) * (light.directional.intensity * light.directional.intensity),
                    (light.directional.diffuse.b * light.directional.diffuse.b) * (light.directional.intensity * light.directional.intensity)));
                //this.mat_cel.setTexture("uTexture", this.textures[3]);
            }
        }
}


// -------------------------------------------------------
// Builder
//
// voxel = {
//    position: Vector3,
//    color: #HEXHEX (UPPERCASE/no alpha)
//    visible: bool,
//    idx: int (read-only)
// }


class Builder {
    constructor() {
        this.isWorking = false;

        this.voxels = [];
        this.mesh = null;

        this.positions = [];
        this.normals = [];
        this.uvs = [];
        this.colors = [];
        this.indices = [];

        this.voxel = null;
        this.vPositions = [];
        this.vNormals = [];
        this.vUvs = [];
        this.vIndices = [];

        this.bufferWorld = [];
        this.bufferColors = [];
        this.bufferMatrix = [];
        this.tMatrix = MatrixIdentity();

        this.rttColors = [];
        this.rttColorsMap = [];
        this.positionsMap = [];

        this.rgbIndex = [];
        this.rgbBuffer = undefined;

        this.init();
    }

    init() {
        this.voxel = CreateBox("voxel", 1, FRONTSIDE, scene);
        this.voxel.isVisible = false;
        this.voxel.isPickable = false;
        this.voxel.receiveShadows = true;
        this.voxel.doNotSerialize = true;
        this.voxel.freezeWorldMatrix();
        this.voxel.freezeNormals();

        this.vPositions = this.voxel.getVerticesData(PositionKind);
        this.vNormals = this.voxel.getVerticesData(NormalKind);
        this.vUvs = this.voxel.getVerticesData(UVKind);
        this.vIndices = this.voxel.getIndices();

        this.mesh = this.voxel.clone();
    }

    create(updateFloor = true) {
        if (this.voxels.length == 0)
            modules.generator.newBox(1, COL_ICE);

        this.isWorking = true;
        
        this.createThinInstances(() => {            
            setTimeout(() => {
                this.isWorking = false;

                if (bvhWhiteList.includes(tool.name))
                    modules.rc.create();
            });
            
            setTimeout(() => {
                if (updateFloor)
                    helper.setFloor();
                palette.create();
                helper.setSymmPivot();
                if (preferences.getWebsocket())
                    modules.ws_client.sendMessage(this.voxels, 'get');
            }, 100);
        });
    }

    createThinInstances(onCreate) {
        this.bufferMatrix = new Float32Array(16 * this.voxels.length);
        this.bufferColors = new Float32Array(4 * this.voxels.length);
        this.rttColors = new Float32Array(4 * this.voxels.length);
        this.rttColorsMap = new Array(this.voxels.length);
        this.positionsMap = new Array(this.voxels.length);

        for (let i = 0; i < this.voxels.length; i++) {
            this.voxels[i].idx = i;

            const voxel = this.voxels[i];

            if (this.getIndexAtPosition(voxel.position) > -1) {
                this.voxels[i].position = RECYCLEBIN;
                this.voxels[i].visible = false;
                duplicateFlag = 1;
            }

            this.tMatrix.m[12] = voxel.position.x;
            this.tMatrix.m[13] = voxel.position.y;
            this.tMatrix.m[14] = voxel.position.z;
            this.tMatrix.m[0] = this.tMatrix.m[5] = this.tMatrix.m[10] = (voxel.visible) ? 1 : 0;
            this.tMatrix.copyToArray(this.bufferMatrix, i * 16);

            this.rgbBuffer = hexToRgbFloat(voxel.color, 2.2);
            this.bufferColors[i * 4] = this.rgbBuffer.r;
            this.bufferColors[i * 4 + 1] = this.rgbBuffer.g;
            this.bufferColors[i * 4 + 2] = this.rgbBuffer.b;
            this.bufferColors[i * 4 + 3] = 1;

            this.rgbIndex = renderTarget.numToColor(i);
            this.rttColors[i * 4] = this.rgbIndex[0] / 255;
            this.rttColors[i * 4 + 1] = this.rgbIndex[1] / 255;
            this.rttColors[i * 4 + 2] = this.rgbIndex[2] / 255;
            this.rttColors[i * 4 + 3] = 1;

            this.rttColorsMap[`${this.rgbIndex[0]}_${this.rgbIndex[1]}_${this.rgbIndex[2]}`] = i;
            this.positionsMap[`${voxel.position.x}_${voxel.position.y}_${voxel.position.z}`] = i;
        }
    
        this.mesh.dispose();
        this.mesh = this.voxel.clone();
        this.mesh.makeGeometryUnique();
        this.mesh.thinInstanceSetBuffer("matrix", this.bufferMatrix, 16, true);
        this.mesh.thinInstanceSetBuffer("color", this.bufferColors, 4, true);
        this.mesh.isVisible = true;
        this.mesh.thinInstanceEnablePicking = false;
        this.mesh.doNotSyncBoundingInfo = false;
        this.mesh.material = material.getMaterial();
        this.mesh.name = "thin";
        //this.mesh.thinInstanceRefreshBoundingInfo(); super expensive task

        renderTarget.pickTexture.renderList = [ this.mesh ];
        renderTarget.pickTexture.setMaterialForRendering(this.mesh, material.mat_white);
        onCreate();
        
        light.addMesh(this.mesh);
        light.updateShadowMap();

        this.bufferMatrix = [];
    }

    // for pathtracer and raw export
    // this function is running faster than in a worker
    fillArrayBuffers() {
        this.bufferWorld = this.mesh.thinInstanceGetWorldMatrices();
        this.positions = new Float32Array(this.vPositions.length * this.voxels.length);
        this.uvs = new Float32Array(this.vUvs.length * this.voxels.length);
        this.colors = new Float32Array(this.vUvs.length * 2 * this.voxels.length);
        this.indices = new Uint32Array(this.vIndices.length * this.voxels.length);

        const lenC = this.vUvs.length * 2;
        const lenI = this.vPositions.length / 3;

        for (let i = 0; i < this.voxels.length; i++) {
            const m = this.bufferWorld[i].m;

            for (let v = 0; v < this.vPositions.length; v += 3) {
                const p = [
                    this.vPositions[v],
                    this.vPositions[v + 1],
                    this.vPositions[v + 2]
                ];
                const transformed = [ // support visibility
                    p[0] * m[0] + p[1] * m[4] + p[2] * m[8] + m[12],
                    p[0] * m[1] + p[1] * m[5] + p[2] * m[9] + m[13],
                    p[0] * m[2] + p[1] * m[6] + p[2] * m[10] + m[14]
                ];
                const rw = 1 / (p[0] * m[3] + p[1] * m[7] + p[2] * m[11] + m[15]);
                this.positions[i * this.vPositions.length + v] = transformed[0] * rw;
                this.positions[i * this.vPositions.length + v + 1] = transformed[1] * rw;
                this.positions[i * this.vPositions.length + v + 2] = transformed[2] * rw;
            }

            for (let v = 0; v < this.vUvs.length; v += 2) {
                this.uvs[i * this.vUvs.length + v] = this.vUvs[v];
                this.uvs[i * this.vUvs.length + v + 1] = this.vUvs[v + 1];
                this.colors[i * lenC + v * 2] = this.bufferColors[i * 4];
                this.colors[i * lenC + v * 2 + 1] = this.bufferColors[i * 4 + 1];
                this.colors[i * lenC + v * 2 + 2] = this.bufferColors[i * 4 + 2];
                this.colors[i * lenC + v * 2 + 3] = 1;
            }

            const len = i * this.vIndices.length;
            for (let v = 0; v < this.vIndices.length; v++) {
                this.indices[len + v] = this.vIndices[v] + i * lenI;
            }
        }
    }

    createMesh() { // for export only
        this.fillArrayBuffers();
        
        this.normals = new Float32Array(this.vNormals.length * this.voxels.length);
        BABYLON.VertexData.ComputeNormals(this.positions, this.indices, this.normals);

        const mesh = new BABYLON.Mesh('mesh', scene);
        const vertexData = new BABYLON.VertexData();
        vertexData.positions = this.positions;
        vertexData.normals = this.normals;
        vertexData.uvs = this.uvs;
        vertexData.colors = this.colors;
        vertexData.indices = this.indices;
        vertexData.applyToMesh(mesh);
        
        material.setPBRTexture();
        mesh.material = material.mat_pbr_msh;
        return mesh;
    }

    getCenter() {
        return this.mesh.getBoundingInfo().boundingSphere.centerWorld;
    }

    getRadius() {
        return this.mesh.getBoundingInfo().boundingSphere.radius;
    }

    getSize() {
        const bounds = this.mesh.getBoundingInfo();
        return Vector3(
            Math.abs(bounds.minimum.x - bounds.maximum.x),
            Math.abs(bounds.minimum.y - bounds.maximum.y),
            Math.abs(bounds.minimum.z - bounds.maximum.z)
        );
    }

    getIndexAtPointer() {
        return this.rttColorsMap[ renderTarget.read() ];
    }

    getIndexAtPosition(pos) {
        return this.positionsMap[`${pos.x}_${pos.y}_${pos.z}`];
    }

    getIndexAtXYZ(x, y, z) {
        return this.positionsMap[`${x}_${y}_${z}`];
    }

    getVoxelsByPosition(pos) {
        return this.voxels.filter(i =>
            i.position.x === pos.x &&
            i.position.y === pos.y &&
            i.position.z === pos.z);
    }

    getVoxelsByColor(hex) {
        return this.voxels.filter(i => i.color === hex);
    }

    getVoxelsByVisibility(isVisible) { // dup
        return this.voxels.filter(i => i.visible === isVisible);
    }

    findIndexByPosition(pos) { // no dup (pre-thin)
        return this.voxels.findIndex(i =>
            i.position.x == pos.x &&
            i.position.y == pos.y &&
            i.position.z == pos.z);
    }

    findIndexByColor(hex) { // no dup, unused (pre-thin)
        return this.voxels.findIndex(i => i.color === hex);
    }

    add(pos, hex, visible) {
        this.voxels.push({ position: pos, color: hex, visible: visible });
    }

    addArray(arr) {
        this.voxels = this.voxels.concat(arr);
    }

    addNoDup(pos, hex, visible) {
        if (this.findIndexByPosition(pos) == -1)
            this.voxels.push({ position: pos, color: hex, visible: visible });
    }

    remove(voxel) {
        const idx = this.voxels.indexOf(voxel);
        if (idx > -1)
            this.voxels.splice(idx, 1);
    }

    removeArray(arr) {
        this.voxels = this.voxels.filter(i => !arr.includes(i));
    }

    removeByPosition(pos) {
        this.removeArray(this.getVoxelsByPosition(pos));
    }

    removeDuplicates() {
        //const last = this.voxels.length;
        this.removeByPosition(RECYCLEBIN);
        this.create();
        //console.log(`remove ${ last - this.voxels.length } duplicates`);
    }

    paintByArray(arr, hex) {
        for (let i = 0; i < arr.length; i++)
            this.voxels[arr[i].idx].color = hex;
    }

    setMeshVisibility(isVisible) {
        this.mesh.isVisible = isVisible;
    }

    setVoxelsVisibility(isVisible) {
        for (let i = 0; i < this.voxels.length; i++)
            this.voxels[i].visible = isVisible;
    }

    setVoxelsVisibilityByColor(hex, isVisible) {
        const voxels = this.getVoxelsByColor(hex);
        for (let i = 0; i < voxels.length; i++)
            this.voxels[voxels[i].idx].visible = isVisible;
        this.create();
        this.update();
    }

    setAllVisibilityAndUpdate(isVisible) {
        for (let i = 0; i < this.voxels.length; i++)
            this.voxels[i].visible = isVisible;
        this.create();
        this.update();
    }

    invertVisibilityAndUpdate() {
        const hiddens = this.getVoxelsByVisibility(false);
        if (hiddens.length == 0) return;

        for (let i = 0; i < this.voxels.length; i++)
            this.voxels[i].visible = !this.voxels[i].visible;
        this.create();
        this.update();
    }

    deleteColorAndUpdate(hex) {
        const group = this.getVoxelsByColor(hex);
        if (group.length == 0) return;
        
        this.removeArray(group);
        this.create();
        this.update();
    }

    async getReduceVoxels(voxels) {
        const msg = await modules.workerPool.postMessage({ id: 'findInnerVoxels', data: [ voxels, this.positionsMap ] });
        if (msg) {
            const data = [];
            for (let i = 0; i < msg.data.length; i++) {
                data.push({
                    position: Vector3(
                        msg.data[i].position._x, msg.data[i].position._y, msg.data[i].position._z),
                    color: msg.data[i].color,
                    visible: msg.data[i].visible
                });
            }
            return data;
        }
        return undefined;
    }

    async deleteHiddenAndUpdate() {
        const hiddens = this.getVoxelsByVisibility(false);

        if (hiddens.length == 0) return;
        if (!await ui.showConfirm('delete hidden voxels?')) return;
        
        this.removeArray(hiddens);
        this.create();
        this.update();
    }

    async setAllColorsAndUpdate(hex = currentColor) {
        if (!await ui.showConfirm('replace all colors?')) return;
        for (let i = 0; i < this.voxels.length; i++) {
            this.voxels[i].visible = true;
            this.voxels[i].color = hex;
        }
        this.create();
        this.update();
    }

    async reduceVoxels() {
        if (!await ui.showConfirm('reducing voxels, continue?<br><span style="color:indianred">notice: may affect<br>bake with color groups</span>')) return;
        ui.showProgress(1);
        const last = this.voxels.length;
        const voxels = await this.getReduceVoxels(this.voxels);
        if (voxels) {
            this.voxels = voxels;
            this.create();
            this.update();
            ui.notification(`${ last - this.voxels.length } voxels removed`);
        } else {
            ui.errorMessage('unable to reduce voxels');
        }
        ui.showProgress(0);
    }

    async normalizeVoxelPositions(isRecordMem) {
        if (isRecordMem && !await ui.showConfirm('normalize voxel positions?')) return;
       
        const bounds = this.mesh.getBoundingInfo();
        const size = Vector3(
            Math.abs(bounds.minimum.x - bounds.maximum.x),
            Math.abs(bounds.minimum.y - bounds.maximum.y),
            Math.abs(bounds.minimum.z - bounds.maximum.z));
        const centerX = (-bounds.boundingBox.center.x + size.x / 2) - 0.5;
        const centerY = (size.y / 2 - bounds.boundingBox.center.y) - 0.5;
        const centerZ = (-bounds.boundingBox.center.z + size.z / 2) - 0.5;
        const tMatrix = MatrixTranslation(centerX, centerY, centerZ);

        for (let i = 0; i < this.voxels.length; i++)
            this.voxels[i].position = Vector3TransformCoordinates(
                this.voxels[i].position, tMatrix);

        this.create();

        if (isRecordMem) {
            this.update();
            camera.frame();
            ui.notification('normalized');
        }
    }

    // voxel-data io

    getDataString() {
        let data = '';
        for (let i = 0; i < this.voxels.length; i++) {
            data += this.voxels[i].position.x + ',' +
                    this.voxels[i].position.y + ',' +
                    this.voxels[i].position.z + ',' +
                    this.voxels[i].color + ',' +
                    this.voxels[i].visible + ';';
        }
        return data;
    }

    getData() {
        return JSON.stringify(this.getDataString());
    }

    setData(data) {
        const voxels = JSON.parse(data);
        
        try {
            this.setDataFromString(voxels);
        } catch (err) {
            // backward compability (fix 'exceeded the quota')
            const newData = [];
            for (let i = 0; i < voxels.length; i++) {
                newData.push({ 
                    position: Vector3(
                        voxels[i].position._x,
                        voxels[i].position._y,
                        voxels[i].position._z
                    ),
                    color: voxels[i].color,
                    visible: voxels[i].visible
                });
            }
            this.voxels = newData;
            this.create();
        }
    }

    setDataFromString(data) {
        const voxels = data.split(';').slice(0, -1);
        const newData = [];
        for (let i = 0; i < voxels.length; i++) {
            const chunk = voxels[i].split(',');
            newData.push({
                position: Vector3(
                    parseFloat(chunk[0]),
                    parseFloat(chunk[1]),
                    parseFloat(chunk[2])
                ),
                color: chunk[3].toUpperCase(),
                visible: parseBool(chunk[4])
            });
        }
        this.voxels = newData;
        this.create();
    }

    setDataFromArray(arr) {
        this.voxels = arr;
        this.create();
    }

    createArrayFromPositions(positions, isSymmetry) {
        const arr = [];

        for (let i = 0; i < positions.length; i++) {
            const idx = this.getIndexAtPosition(positions[i]);
            if (idx > -1 && builder.voxels[idx].visible) {
                arr.push(builder.voxels[idx]);

                if (isSymmetry) {
                    const idx = this.getIndexAtPosition(symmetry.invertPos(positions[i]));
                    if (idx > -1 && builder.voxels[idx].visible)
                        arr.push(builder.voxels[idx]);
                }
            }
        }
        return arr;
    }

    createArrayFromNewPositions(positions, hex, isSymmetry) {
        const arr = [];

        for (let i = 0; i < positions.length; i++) {
            arr.push({
                position: positions[i],
                color: hex,
                visible: true
            });

            if (isSymmetry) {
                arr.push({
                    position: symmetry.invertPos(positions[i]),
                    color: hex,
                    visible: true
                });
            }
        }
        return arr;
    }

    update() {
        memory.record(this.getData());
    }
}


// -------------------------------------------------------
// Transformers


class Transformers {
    constructor() {
        this.root = new BABYLON.TransformNode('xformer');
        this.isActive = false;
        this.isNewObject = false;
        this.origins = [];
        this.indexes = [];
        this.startPos = null;
        this.useColors = false;
    }

    begin(voxels) {
        if (voxels.length == 0) return;
        this.origins = voxels;

        ghosts.createThin(voxels);

        this.root.position.copyFrom(ghosts.getCenter());
        ghosts.thin.setParent(this.root);

        uix.bindVoxelGizmo(this.root);
        this.startPos = this.root.position.clone();

        this.indexes = [];
        for (let i = 0; i < voxels.length; i++) {
            if (this.indexes.indexOf(voxels[i].idx) == -1) { // duplicates broke transform
                this.indexes.push(voxels[i].idx);
                builder.voxels[ voxels[i].idx ].visible = ui.domTransformClone.checked;
            }
        }

        if (!ui.domTransformClone.checked)
            builder.create(false);

        this.isActive = true;
    }

    finish() {
        if (this.isActive) {
            const p = this.root.position.subtract(this.startPos);

            if (!p.equals(Vector3(0, 0, 0))) { // change on move
                if (!ui.domTransformClone.checked) {
                    for (let i = 0; i < this.indexes.length; i++) {
                        builder.voxels[ this.indexes[i] ].position.addInPlace(p);
                        builder.voxels[ this.indexes[i] ].visible = true;
                    }
                } else {
                    for (let i = 0; i < this.indexes.length; i++) {
                        builder.add(builder.voxels[ this.indexes[i] ].position.add(p),
                                    builder.voxels[ this.indexes[i] ].color, true);
                    }
                }
            } else {
                if (!ui.domTransformClone.checked) {
                    for (let i = 0; i < this.indexes.length; i++)
                        builder.voxels[ this.indexes[i] ].visible = true;
                }
            }
        }
    }

    beginNewObject(voxels, useColors = false) {
        if (voxels.length == 0) return;
        this.origins = voxels;
        this.useColors = useColors;

        tool.toolSelector('camera');
        ghosts.createThin(voxels);
        
        this.root.position.copyFrom(ghosts.getCenter());
        ghosts.thin.setParent(this.root);

        uix.bindVoxelGizmo(this.root);
        this.startPos = this.root.position.clone();

        this.isActive = true;
        this.isNewObject = true;
    }

    finishNewObject() {
        if (this.isNewObject) {
            const p = this.root.position.subtract(this.startPos);
            
            if (this.useColors) {
                for (let i = 0; i < this.origins.length; i++) {
                    this.origins[i].position.addInPlace(p);
                    builder.add(this.origins[i].position, this.origins[i].color, true);
                }
            } else {
                for (let i = 0; i < this.origins.length; i++) {
                    this.origins[i].position.addInPlace(p);
                    builder.add(this.origins[i].position, COL_ICE, true);
                }
            }
        }
    }

    apply() {
        if (this.isActive || this.isNewObject) {
            this.finish();
            this.finishNewObject();
            
            builder.create();
            builder.update();

            this.dispose();
        }
    }

    dispose() {
        this.isActive = false;
        this.isNewObject = false;

        uix.unbindVoxelGizmo();
        
        ghosts.thin.setParent(null);
        ghosts.disposeThin();
        
        this.origins = [];
        this.indexes = [];
    }

    deleteSelected() {
        if (this.isActive || this.isNewObject) {
            if (!ui.domTransformClone.checked) {
                builder.removeArray(this.origins);
                builder.create();
                builder.update();
                this.dispose();
            } else {
                ui.notification('uncheck clone');
            }
        }
    }
}


// -------------------------------------------------------
// Ghosts


class Ghosts {
    constructor() {
        this.voxel = undefined;
        this.voxelPick = undefined;
        this.thin = undefined;
        this.sps = undefined;
        this.spsPick = undefined;
        this.cloud = undefined;
        this.tMatrix = MatrixIdentity();
        this.bufferMatrix = [];
        this.bufferColors = [];

        this.init();
    }

    init() {
        this.voxel = CreateBox("ghost_voxel", 1, FRONTSIDE, scene);
        this.voxel.isVisible = false;
        this.voxel.isPickable = false;
        this.voxel.receiveShadows = false;
        this.voxel.doNotSerialize = true;
        this.voxel.freezeWorldMatrix();
        this.voxel.freezeNormals();

        this.voxelPick = CreateBox("ghost_voxelpick", 1.1, FRONTSIDE, scene);
        this.voxelPick.isVisible = false;
        this.voxelPick.isPickable = false;
        this.voxelPick.receiveShadows = false;
        this.voxelPick.doNotSerialize = true;
        this.voxelPick.freezeNormals();

        this.disposeThin(); // init
    }

    createThin(voxels) {
        if (voxels.length == 0) return;

        if (this.thin)
            this.thin.dispose();

        this.bufferMatrix = new Float32Array(16 * voxels.length);
        this.bufferColors = new Float32Array(4 * voxels.length);

        for (let i = 0; i < voxels.length; i++) {
            this.tMatrix.m[12] = voxels[i].position.x;
            this.tMatrix.m[13] = voxels[i].position.y;
            this.tMatrix.m[14] = voxels[i].position.z;
            this.tMatrix.m[0] = this.tMatrix.m[5] = this.tMatrix.m[10] = (voxels[i].visible) ? 1 : 0;
            this.tMatrix.copyToArray(this.bufferMatrix, i * 16);
        }

        this.bufferColors.fill(1);
    
        this.thin = this.voxel.clone();
        this.thin.makeGeometryUnique();
        this.thin.thinInstanceSetBuffer("matrix", this.bufferMatrix, 16, true);
        this.thin.thinInstanceSetBuffer("color", this.bufferColors, 4, true);
        this.thin.isVisible = true;
        this.thin.thinInstanceEnablePicking = false;
        this.thin.material = material.mat_highlight;
        this.thin.material.diffuseColor = Color3(1, 1, 1);

        // TODO: visual artifacts with thin-instances
        helper.highlightOverlayMesh(this.thin, COL_ORANGE_RGB, 0.5);
        helper.highlightOutlineMesh(this.thin, COL_ORANGE_RGBA);

        light.addMesh(this.thin);
        light.updateShadowMap();

        this.bufferMatrix = [];
        this.bufferColors = [];
    }

    addThin(pos, hex) {
        this.thin.isVisible = true;
        this.thin.material = material.mat_highlight;
        this.thin.material.diffuseColor = color3FromHex(hex);
        this.thin.thinInstanceAdd(MatrixTranslation(pos.x, pos.y, pos.z));
    }

    disposeThin() {
        if (xformer.isActive) return;

        if (this.thin)
            this.thin.dispose();

        this.thin = this.voxel.clone();
        this.thin.isVisible = false;
        this.thin.name = "ghost_thin";
    }

    createSPS(voxels = builder.voxels) {
        if (voxels.length == 0) return;

        if (this.sps)
            this.sps.dispose();
        
        this.sps = new BABYLON.SolidParticleSystem('ghost_sps', scene, { updatable: false, expandable: false, boundingSphereOnly: true });

        this.sps.addShape(this.voxel, voxels.length, { positionFunction: (p, i, s) => {
            p.position.copyFrom(voxels[i].position);
            p.color = color4FromHex(voxels[i].color);
            if (!voxels[i].visible) p.scaling.set(0,0,0);
        }});

        this.sps.initParticles();
        this.sps.buildMesh();
        this.sps.computeBoundingBox = false;
        this.sps.mesh.isPickable = false;
        this.sps.mesh.doNotSerialize = true;
        this.sps.mesh.freezeNormals();
    }

    disposeSPS() {
        if (this.sps)
            this.sps.dispose();
        this.sps = null;
    }

    // SPS used for picking after the SPS-voxel-engine fallout
    createSPSPick(voxels) {
        if (this.spsPick)
            this.spsPick.dispose();
        
        this.spsPick = new BABYLON.SolidParticleSystem('ghost_spspick', scene, { updatable: false, expandable: false, boundingSphereOnly: false });
        
        this.spsPick.addShape(this.voxelPick, voxels.length, { positionFunction: (p, i, s) => {
            p.position.copyFrom(voxels[i].position);
            if (!voxels[i].visible) p.scaling.set(0,0,0);
        }});

        this.spsPick.initParticles();
        this.spsPick.buildMesh();
        this.spsPick.computeBoundingBox = true;
        this.spsPick.mesh.isPickable = true;
        this.spsPick.mesh.doNotSerialize = true;
        if (!ui.domDevMode.checked)
            this.spsPick.mesh.layerMask = 0x00000000;
    }

    createPointCloud(voxels = builder.voxels) {
        if (voxels.length == 0) return;

        if (this.cloud)
            this.cloud.dispose();
        
        this.cloud = new BABYLON.PointsCloudSystem('ghost_cloud', 2, scene, { updatable: false });
        this.cloud.computeBoundingBox = false;

        const setParticles = function(particle, i, s) {
            particle.position.copyFrom(voxels[s].position);
            particle.position.x += 0.2 * Math.random() - 0.1;
            particle.position.y += 0.2 * Math.random() - 0.1;
            particle.position.z += 0.2 * Math.random() - 0.1;
            particle.color = color4FromHex(voxels[s].color);
        };

        this.cloud.addPoints(voxels.length, setParticles);
        this.cloud.buildMeshAsync().then((mesh) => {
            mesh.visibility = 0.28;
            mesh.isPickable = false;
            mesh.doNotSerialize = true;
            mesh.doNotSyncBoundingInfo = true;
            mesh.freezeWorldMatrix();
            mesh.freezeNormals();
        });
    }

    disposePointCloud() {
        if (this.cloud)
            this.cloud.dispose();
        this.cloud = null;
    }

    getCenter() {
        return this.thin.getBoundingInfo().boundingSphere.centerWorld;
    }
}


// -------------------------------------------------------
// Palette


class Palette {
    constructor() {
        this.canvas = document.getElementById('canvas_palette');
        this.size = 28;
        this.pad = 2;
        this.wPad = this.size + this.pad;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.uniqueColors = [];
        this.invisibleColors = [];
        
        this.init();
    }
    
    init() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.canvas.addEventListener("pointerdown", (ev) => {
            const hex = this.getCanvasColor(this.ctx, ev.offsetX, ev.offsetY);
            if (hex && this.uniqueColors.includes(hex)) {
                currentColor = hex;
                uix.colorPicker.value = color3FromHex(hex);
            }
        }, false);
                
        this.canvas.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            const hex = this.getCanvasColor(this.ctx, ev.offsetX, ev.offsetY);
            if (hex && this.uniqueColors.includes(hex)) {
                const index = this.invisibleColors.indexOf(hex);
                (index > -1) ?
                    this.invisibleColors.splice(index, 1) :
                    this.invisibleColors.push(hex);
                builder.setVoxelsVisibilityByColor(hex, index > -1);
            }
        }, false);

        this.canvas.addEventListener("dblclick", (ev) => {
            const hex = this.getCanvasColor(this.ctx, ev.offsetX, ev.offsetY);
            if (hex && this.uniqueColors.includes(hex)) {
                const index = this.invisibleColors.indexOf(hex);
                (index > -1) ?
                    this.invisibleColors.splice(index, 1) :
                    this.invisibleColors.push(hex);
                builder.setVoxelsVisibilityByColor(hex, index > -1);
            }
        }, false);

        new ResizeObserver(() => {
            this.create();
        }).observe(this.canvas);
    }

    create() {
        const wPadSize = this.wPad * parseInt(preferences.getPaletteSize());

        ui.domPalette.style.width = 8 + wPadSize + "px";
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.uniqueColors = [];
        this.invisibleColors = [];

        let col = 0;
        let row = this.pad;
        for (let i = 0; i < builder.voxels.length; i++) {
            if (this.uniqueColors.indexOf(builder.voxels[i].color) == -1) {
                
                if (!builder.voxels[i].visible)
                    this.invisibleColors.push(builder.voxels[i].color);

                this.addColor(col + this.pad, row, builder.voxels[i].color);
                this.uniqueColors.push(builder.voxels[i].color);

                col += this.wPad;
                if (col >= wPadSize) {
                    col = 0;
                    row += this.size + this.pad;
                }
            }
        }
    }

    expand(num, pad = 2) {
        ui.domPalette.style.width = 8 + ((this.size + pad) * num) + "px";
        this.canvas.width = ui.domPalette.clientWidth;
    }
    
    addColor(x, y, hex) {
        this.ctx.strokeStyle = 'transparent';
        if (this.invisibleColors.indexOf(hex) > -1) {
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'orange';
            this.ctx.strokeRect(x, y, this.size, this.size);
        }
        this.ctx.fillStyle = hex;
        this.ctx.fillRect(x, y, this.size, this.size);
    }

    getCanvasColor(context, x, y) {
        const data = context.getImageData(x, y, 1, 1).data;
        return (data[3] > 0) ? rgbIntToHex(data[0], data[1], data[2]) : undefined;
    }
}


// -------------------------------------------------------
// Helper


class Helper {
    constructor() {
        this.floorPlane = CreatePlane("floorplane", 4, DOUBLESIDE, scene);
        this.gridPlane = CreatePlane("gridplane", 2500, BACKSIDE, scene);
        this.workplane = CreatePlane("workplane", WORKPLANE_SIZE, BACKSIDE, scene);
        this.axisPlane = CreatePlane("axisplane", 4, DOUBLESIDE, uix.utilLayer.utilityLayerScene);
        this.overlayPlane = CreatePlane("overlay_plane", 1, DOUBLESIDE, scene);
        this.overlayCube = CreateBox("overlay_cube", 1, FRONTSIDE, scene);
        this.boxShape = CreateBox("boxshape", 1, FRONTSIDE, scene);
        this.boxShapeSymm = CreateBox("boxshapesymm", 1, FRONTSIDE, scene);
        this.symmPivot = undefined;
        this.isWorkplaneActive = false;
        this.isFloorPlaneActive = false;

        this.init();
    }

    init() {
        this.floorPlane.material = material.mat_floor;
        this.floorPlane.visibility = 0.07;
        this.floorPlane.isVisible = true; // overrided
        this.floorPlane.isPickable = false;
        this.floorPlane.position.x = -0.5;
        this.floorPlane.position.y = -0.5;
        this.floorPlane.position.z = -0.5;
        this.floorPlane.rotation.x = PIH;
        this.floorPlane.doNotSerialize = true;
        this.floorPlane.freezeNormals();
        
        this.axisPlane.isVisible = false; // indicate symmetry-axis plane in AxisView scene
        this.axisPlane.isPickable = false;
        this.axisPlane.visibility = 0.01;
        this.axisPlane.doNotSerialize = true;
        this.highlightOverlayMesh(this.axisPlane, COL_AQUA_RGB, 0.15); // overrided
        this.axisPlane.edgesWidth = 6;
        this.axisPlane.edgesColor = COL_AQUA_RGBA;
        this.axisPlane.enableEdgesRendering();
        this.axisPlane.freezeNormals();

        this.overlayPlane.isVisible = false;
        this.overlayPlane.isPickable = false;
        this.overlayPlane.visibility = 0.01;
        this.overlayPlane.doNotSerialize = true;
        this.highlightOverlayMesh(this.overlayPlane, COL_ORANGE_RGB, 1);
        this.overlayPlane.freezeNormals();

        this.overlayCube.isVisible = false;
        this.overlayCube.isPickable = false;
        this.overlayCube.visibility = 0.1;
        this.overlayCube.doNotSerialize = true;
        this.highlightOverlayMesh(this.overlayCube, COL_ORANGE_RGB);
        this.overlayCube.freezeNormals();

        this.gridPlane.position.copyFrom(this.floorPlane.position);
        this.gridPlane.rotation.x = -PIH;
        this.gridPlane.material = material.mat_workplane;
        this.gridPlane.isVisible = false;
        this.gridPlane.isPickable = true; // overrided
        this.gridPlane.visibility = WORKPLANE_VISIBILITY;
        this.gridPlane.doNotSerialize = true;
        this.gridPlane.freezeNormals();

        const wpHalf = WORKPLANE_SIZE / 2;
        const wpVol = [
            this.workplane.clone(),
            this.workplane.clone(),
            this.workplane.clone()
        ];
        wpVol[0].position.set(wpHalf, 0, wpHalf);
        wpVol[1].position.set(0, wpHalf, wpHalf);
        wpVol[2].position.set(wpHalf, wpHalf, 0);
        wpVol[0].rotation.x = -PIH;
        wpVol[1].rotation.y = PIH;
        wpVol[2].rotation.z = PIH;
        this.workplane.dispose();
        this.workplane = MergeMeshes(wpVol, true, true);
        this.workplane.name = 'workplane';
        pool.resetPivot(this.workplane);
        wpVol[0].dispose();
        wpVol[1].dispose();
        wpVol[2].dispose();

        this.workplane.material = material.mat_workplane;
        this.workplane.isVisible = false;
        this.workplane.isPickable = true;
        this.workplane.position.x = wpHalf - 0.5;
        this.workplane.position.y = wpHalf - 0.5;
        this.workplane.position.z = wpHalf - 0.5;
        this.workplane.visibility = WORKPLANE_VISIBILITY;
        this.workplane.doNotSerialize = true;
        this.workplane.freezeNormals();

        this.boxShape.isVisible = false;
        this.boxShape.isPickable = false;
        this.boxShape.visibility = 0.1;
        this.boxShape.renderOverlay = true;
        this.boxShape.doNotSerialize = true;
        this.highlightOverlayMesh(this.boxShape, COL_ORANGE_RGB);
        this.highlightEdgesMesh(this.boxShape, COL_ORANGE_RGBA);
        this.boxShape.freezeNormals();

        this.boxShapeSymm.renderingGroupId = 1;
        this.boxShapeSymm.isVisible = false;
        this.boxShapeSymm.isPickable = false;
        this.boxShapeSymm.visibility = 0.1;
        this.boxShapeSymm.doNotSerialize = true;
        this.highlightEdgesMesh(this.boxShapeSymm, COL_AQUA_RGBA);
        this.boxShapeSymm.edgesColor.a = 0.4;
        this.boxShapeSymm.freezeNormals();

        const r = Math.max(10, ~~builder.getRadius());
        const axisLines = [
            [ Vector3(0, 0, 0), Vector3(r, 0, 0) ],
            [ Vector3(0, 0, 0), Vector3(0, r, 0) ],
            [ Vector3(0, 0, 0), Vector3(0, 0, r) ]
        ];
        const axisColors = [
            [ COL_AXIS_X_RGBA, COL_AXIS_X_RGBA ],
            [ COL_AXIS_Y_RGBA, COL_AXIS_Y_RGBA ],
            [ COL_AXIS_Z_RGBA, COL_AXIS_Z_RGBA ]
        ];
        this.symmPivot = CreateLine("symmpivot", axisLines, axisColors, uix.utilLayer.utilityLayerScene);
        this.symmPivot.isVisible = false;
        this.symmPivot.doNotSerialize = true;
        this.symmPivot.isPickable = false;
    }

    setFloor() {
        const f = camera.getFramed(builder.mesh);
        if (f) {
            this.floorPlane.scaling.x = f.radius;
            this.floorPlane.scaling.y = f.radius;
            this.floorPlane.scaling.z = 1;
            this.floorPlane.material.gridRatio = 1 / f.radius;
        }
    }

    enableFloorPlane(isEnabled) {
        this.isFloorPlaneActive = isEnabled;
        this.displayGridPlane(isEnabled);
        if (isEnabled)
            this.enableWorkplane(false);
    }

    enableWorkplane(isEnabled) {
        this.isWorkplaneActive = isEnabled;
        this.displayWorkplane(isEnabled);
        if (isEnabled)
            this.enableFloorPlane(false);
    }

    displayWorkplane(isEnabled) {
        this.workplane.isVisible = isEnabled;
        if (isEnabled) {
            ui.domInScreenWorkplane.firstChild.style.color = COL_ORANGE;
        } else {
            ui.domInScreenWorkplane.firstChild.style.color = COL_AQUA;
        }
    }

    displayGridPlane(isEnabled, isPickable = true) {
        this.gridPlane.isVisible = isEnabled;
        this.gridPlane.isPickable = isPickable;
        if (isEnabled) {
            ui.domInScreenGridPlane.firstChild.style.color = COL_ORANGE;
        } else {
            ui.domInScreenGridPlane.firstChild.style.color = COL_AQUA;
        }
    }

    toggleWorkplane(id) {
        if (id == 0) {
            this.isFloorPlaneActive = !this.isFloorPlaneActive;
            this.displayGridPlane();
            this.enableFloorPlane(this.isFloorPlaneActive);
        } else {
            this.isWorkplaneActive = !this.isWorkplaneActive;
            this.displayWorkplane();
            this.enableWorkplane(this.isWorkplaneActive);
        }
    }

    setSymmPivot() {
        this.symmPivot.isVisible = (symmetry.axis !== -1);
        if (this.symmPivot.isVisible) {
            if (ui.domSymmCenter.checked) { // world
                this.symmPivot.position = Vector3(0, 0, 0);
                this.symmPivot.position.x -= 0.5;
                this.symmPivot.position.y -= 0.5;
                this.symmPivot.position.z -= 0.5;
            } else { // local
                this.symmPivot.position = builder.getCenter();
            }

            this.symmPivot.scaling = Vector3(1, 1, 1);
            if (symmetry.axis == AXIS_X) this.symmPivot.scaling.x *= 2.2;
            if (symmetry.axis == AXIS_Y) this.symmPivot.scaling.y *= 2.2;
            if (symmetry.axis == AXIS_Z) this.symmPivot.scaling.z *= 2.2;

            this.axisPlane.position.copyFrom(this.symmPivot.position);
        }
    }

    setAxisPlane(axis) {
        this.axisPlane.isVisible = true;
        this.axisPlane.position.copyFrom(this.symmPivot.position);
        this.axisPlane.rotation = Vector3(0, 0, 0);
        if (axis.x == 1) {
            this.axisPlane.rotation.y = PIH;
            this.axisPlane.overlayColor = COL_AXIS_X_RGB;
            this.axisPlane.edgesColor = COL_AXIS_X_RGBA;
        }
        else if (axis.y == 1) {
            this.axisPlane.rotation.x = PIH;
            this.axisPlane.overlayColor = COL_AXIS_Y_RGB;
            this.axisPlane.edgesColor = COL_AXIS_Y_RGBA;
        }
        else if (axis.z == 1) {
            this.axisPlane.rotation.z = PIH;
            this.axisPlane.overlayColor = COL_AXIS_Z_RGB;
            this.axisPlane.edgesColor = COL_AXIS_Z_RGBA;
        }
        this.axisPlane.edgesColor.a = 0.6;
    }

    toggleAxisPlane(isVisible) {
        this.axisPlane.isVisible = isVisible;
        this.symmPivot.isVisible = isVisible;
    }

    setOverlayPlane(pos, normAxis) {
        this.overlayPlane.isVisible = true;
        this.overlayPlane.position = pos;

        if ((normAxis.x == 0 && normAxis.y == 0 && normAxis.z == 1) ||
            (normAxis.x == 0 && normAxis.y == 0 && normAxis.z == -1)) {
            this.overlayPlane.rotationQuaternion = BABYLON.Quaternion.RotationAxis(
                BABYLON.Axis.X,
                Math.acos(BABYLON.Vector3.Dot(normAxis, BABYLON.Axis.Z)));
        } else {
            this.overlayPlane.rotationQuaternion = BABYLON.Quaternion.RotationAxis(
                BABYLON.Vector3.Cross(BABYLON.Axis.Z, normAxis), // axis
                Math.acos(BABYLON.Vector3.Dot(normAxis, BABYLON.Axis.Z))); // angle
        }
    }

    setOverlayCube(pos, color = COL_ORANGE_RGB) {
        this.overlayCube.isVisible = true;
        this.overlayCube.position = pos;
        this.overlayCube.overlayColor = color;
    }

    clearOverlays() {
        this.overlayPlane.isVisible = false;
        this.overlayCube.isVisible = false;
    }

    setBoxShape(pos, scale, color) {
        this.boxShape.isVisible = true;
        this.boxShape.position = pos;
        this.boxShape.scaling = scale;
        this.boxShape.overlayColor = color;
        this.fixEdgesWidth(this.boxShape);
    }

    setBoxShapeSymmetry(pos, scale, color) {
        this.boxShapeSymm.isVisible = true;
        this.boxShapeSymm.position = pos;
        this.boxShapeSymm.scaling = scale;
        this.boxShapeSymm.overlayColor = color;
        this.fixEdgesWidth(this.boxShapeSymm);
    }

    setBoxShapeColor(hex) {
        this.boxShape.overlayColor = color3FromHex(hex);
    }

    clearBoxShape() {
        this.boxShape.isVisible = false;
        this.boxShape.position = Vector3(0, 0, 0);
        this.boxShape.scaling = Vector3(0, 0, 0);
        this.boxShapeSymm.isVisible = false;
        this.boxShapeSymm.position = Vector3(0, 0, 0);
        this.boxShapeSymm.scaling = Vector3(0, 0, 0);
    }

    highlightOverlayMesh(mesh, color3, alpha = 0.5) {
        mesh.renderOverlay = true;
        mesh.overlayAlpha = alpha;
        mesh.overlayColor = color3;
    }
    
    highlightOutlineMesh(mesh, color3, width = 0.05) {
        mesh.renderOutline = true;
        mesh.outlineColor = color3;
        mesh.outlineWidth = width;
    }
    
    highlightEdgesMesh(mesh, color4, width = 6) { // do not use in a loop
        mesh.edgesWidth = width;
        mesh.edgesColor = color4;
        mesh.enableEdgesRendering();
        this.fixEdgesWidth(mesh);
    }
    
    fixEdgesWidth(mesh) {
        mesh.edgesWidth = scene.activeCamera.radius / 8;
        if (scene.activeCamera.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA)
            mesh.edgesWidth /= 6;
    }
}


// -------------------------------------------------------
// Symmetry


class Symmetry {
    constructor() {
        this.axis = -1; // AXIS_X
    }

    setAxis(axis) {
        this.axis = axis;
        helper.toggleAxisPlane(false);
        helper.setSymmPivot();

        if (axis == AXIS_X) {
            helper.setAxisPlane(AXIS_X);
            ui.domSymmAxisS.style.color = '#98a1ac';
            ui.domSymmAxisX.style.color = COL_AXIS_X;
            ui.domSymmAxisY.style.color = '#98a1ac';
            ui.domSymmAxisZ.style.color = '#98a1ac';
            ui.domInScreenSymmAxis.innerHTML = 'X';
            ui.domInScreenSymmAxis.style.color = COL_AXIS_X;
        } else if (axis == AXIS_Y) {
            helper.setAxisPlane(AXIS_Y);
            ui.domSymmAxisS.style.color = '#98a1ac';
            ui.domSymmAxisX.style.color = '#98a1ac';
            ui.domSymmAxisY.style.color = COL_AXIS_Y;
            ui.domSymmAxisZ.style.color = '#98a1ac';
            ui.domInScreenSymmAxis.innerHTML = 'Y';
            ui.domInScreenSymmAxis.style.color = COL_AXIS_Y;
        } else if (axis == AXIS_Z) {
            helper.setAxisPlane(AXIS_Z);
            ui.domSymmAxisS.style.color = '#98a1ac';
            ui.domSymmAxisX.style.color = '#98a1ac';
            ui.domSymmAxisY.style.color = '#98a1ac';
            ui.domSymmAxisZ.style.color = COL_AXIS_Z;
            ui.domInScreenSymmAxis.innerHTML = 'Z';
            ui.domInScreenSymmAxis.style.color = COL_AXIS_Z;
        } else {
            ui.domSymmAxisS.style.color = '#98a1ac';
            ui.domSymmAxisX.style.color = '#98a1ac';
            ui.domSymmAxisY.style.color = '#98a1ac';
            ui.domSymmAxisZ.style.color = '#98a1ac';
            ui.domInScreenSymmAxis.innerHTML = 'S';
            ui.domInScreenSymmAxis.style.color = COL_AQUA + 'AA';
        }
    }

    switchAxis() {
        if (this.axis == -1) {
            this.setAxis(AXIS_X);
        } else if (this.axis == AXIS_X) {
            this.setAxis(AXIS_Y);
        } else if (this.axis == AXIS_Y) {
            this.setAxis(AXIS_Z);
        } else if (this.axis == AXIS_Z) {
            this.resetAxis();
        }
    }

    switchAxisByNum(axis) {
        if (axis == -1) {
            this.resetAxis();
        } else if (axis == 0) {
            this.setAxis(AXIS_X);
        } else if (axis == 1) {
            this.setAxis(AXIS_Y);
        } else if (axis == 2) {
            this.setAxis(AXIS_Z);
        }
    }

    resetAxis() {
        this.setAxis(-1);
    }

    symmetrizeVoxels(side) {
        if (this.axis == -1) {
            ui.notification('select symmetry axis');
            return;
        }
        builder.setVoxelsVisibility(true);
        this.deleteHalf(side);
        this.invertVoxelsClone();
        builder.create();
        builder.update();
    }

    mirrorVoxels() {
        if (this.axis == -1) {
            ui.notification('select symmetry axis');
            return;
        }
        builder.setVoxelsVisibility(true);
        this.invertVoxels();
        builder.create();
        builder.update();
    }

    deleteHalfVoxels(side) {
        if (this.axis == -1) {
            ui.notification('select symmetry axis');
            return;
        }
        builder.setVoxelsVisibility(true);
        this.deleteHalf(side);
        builder.create();
        builder.update();
    }

    invertVoxels() {
        for (let i = 0; i < builder.voxels.length; i++)
            builder.voxels[i].position = this.invertPos(builder.voxels[i].position);
    }

    invertVoxelsClone() {
        const toAdd = [];
        for (let i = 0; i < builder.voxels.length; i++) {
            toAdd.push({
                position: this.invertPos(builder.voxels[i].position),
                color: builder.voxels[i].color,
                visible: true
            });
        }
        builder.addArray(toAdd);
    }

    deleteHalf(side) { // preserve 0 borders, prevent duplicates at the middle
        const toDelete = [];

        for (let i = 0; i < builder.voxels.length; i++) { // reminder 0.00000001 vertex
            const p = builder.voxels[i].position;
            if (this.axis == AXIS_X) {
                if (side == -1 && this.center(p.x) <= -0.1) toDelete.push(builder.voxels[i]);
                if (side == 1  && this.center(p.x) >= 0.1)  toDelete.push(builder.voxels[i]);
            }
            else if (this.axis == AXIS_Y) {
                if (side == -1 && this.center(p.y) <= -0.1) toDelete.push(builder.voxels[i]);
                if (side == 1  && this.center(p.y) >= 0.1)  toDelete.push(builder.voxels[i]);
            }
            else if (this.axis == AXIS_Z) {
                if (side == -1 && this.center(p.z) <= -0.1) toDelete.push(builder.voxels[i]);
                if (side == 1  && this.center(p.z) >= 0.1)  toDelete.push(builder.voxels[i]);
            }
        }

        builder.removeArray(toDelete);
    }

    invertPos(p) { // invert positive to negative and reverse
        if (this.axis == AXIS_X) p = Vector3(this.center2(p.x), p.y, p.z);
        if (this.axis == AXIS_Y) p = Vector3(p.x, this.center2(p.y), p.z);
        if (this.axis == AXIS_Z) p = Vector3(p.x, p.y, this.center2(p.z));
        return p;
    }

    center(p) { // calculate position from center
        if (ui.domSymmCenter.checked) { // world center
            if (this.axis == AXIS_X) return -0.5 - p;
            if (this.axis == AXIS_Y) return -0.5 - p;
            if (this.axis == AXIS_Z) return -0.5 - p;
        } else { // local center
            const center = builder.getCenter();
            if (this.axis == AXIS_X) return center.x - p;
            if (this.axis == AXIS_Y) return center.y - p;
            if (this.axis == AXIS_Z) return center.z - p;
        }
    }

    center2(p) { // calculate position from center*2
        if (ui.domSymmCenter.checked) { // world center
            if (this.axis == AXIS_X) return -1 - p;
            if (this.axis == AXIS_Y) return -1 - p;
            if (this.axis == AXIS_Z) return -1 - p;
        } else { // local center
            const center = builder.getCenter();
            if (this.axis == AXIS_X) return (center.x * 2) - p;
            if (this.axis == AXIS_Y) return (center.y * 2) - p;
            if (this.axis == AXIS_Z) return (center.z * 2) - p;
        }
    }

    findIndexInvert(p) {
        return builder.getIndexAtPosition(this.invertPos(p));
    }
}


// -------------------------------------------------------
// Tool


class Tool {
    constructor() {
        this.name = 'camera';
        this.last = null;
        this.selected = [];
        this.isMouseDown = false;

        this.normal = null;
        this.isSymmetry = false;
        this.isWorkplane = false;
        this.startBox = null;
        this.startRect = null;
        this.pos = null;
        this.posNorm = null;
        this.box = { sX: 0, sY: 0, sZ: 0, eX: 0, eY: 0, eZ: 0 };
        this.boxCount = 0;
        this.fixedHeight = 0;
        this.tmp = [];
        this.tmpsps = [];

        this.then = performance.now();
        this.now = 0;
        this.elapsed = 0;

        this.toolSelector(this.name);
    }

    add(pos) {
        builder.addNoDup(pos, currentColor, true);
        ghosts.addThin(pos, currentColor);

        if (this.isSymmetry) {
            pos = symmetry.invertPos(pos);
            builder.addNoDup(pos, currentColor, true);
            ghosts.addThin(pos, currentColor);
        }

        this.selected.push('');
    }

    addNoHelper(pos) {
        this.selected.push(pos);

        if (this.isSymmetry)
            this.selected.push(symmetry.invertPos(pos));
    }

    remove(pos) {
        if (this.selected.indexOf(pos) == -1) {
            this.selected.push(pos);
            ghosts.addThin(pos, COL_RED);

            if (this.isSymmetry) {
                pos = symmetry.invertPos(pos);
                this.selected.push(pos);
                ghosts.addThin(pos, COL_RED);
            }
        }
    }

    removeNoHelper(pos) {
        this.selected.push(pos);

        if (this.isSymmetry)
            this.selected.push(symmetry.invertPos(pos));
    }

    paint(index, pos) {
        builder.voxels[index].color = currentColor;
        ghosts.addThin(pos, currentColor);

        if (this.isSymmetry) {
            const index = symmetry.findIndexInvert(pos);
            if (index > -1) {
                builder.voxels[index].color = currentColor;
                ghosts.addThin(builder.voxels[index].position, currentColor);
            }
        }
    }

    bucket(hex) {
        for (let i = 0; i < builder.voxels.length; i++) {
            if (builder.voxels[i].color === hex)
                builder.voxels[i].color = currentColor;
        }
    }

    eyedrop(hex) {
        currentColor = hex;
        uix.colorPicker.value = color3FromHex(currentColor);
    }

    calculateBoundingBox(start, end) {
        this.box.sX = Math.min(start.x, end.x);
        this.box.eX = Math.max(start.x, end.x);
        this.box.sY = Math.min(start.y, end.y);
        this.box.eY = Math.max(start.y, end.y);
        this.box.sZ = Math.min(start.z, end.z);
        this.box.eZ = Math.max(start.z, end.z);
    }

    boxShape(start, end, color) {
        this.calculateBoundingBox(start, end);

        const scale = Vector3(
            1 + this.box.eX - this.box.sX,
            1 + this.box.eY - this.box.sY,
            1 + this.box.eZ - this.box.sZ);

        helper.setBoxShape(start.add(end).divide(VEC3_TWO), scale, color);
        
        if (this.isSymmetry) {
            helper.setBoxShapeSymmetry(
                symmetry.invertPos(start).add(symmetry.invertPos(end)).divide(VEC3_TWO),
                scale, color);
        }

        this.boxCount = helper.boxShape.scaling.x * helper.boxShape.scaling.y * helper.boxShape.scaling.z;
        if (this.boxCount > MAX_VOXELS_DRAW)
            helper.setBoxShapeColor(COL_RED);
    }

    boxSelectAdd(start, end, color) {
        if (this.fixedHeight > 1) // enable wall drawing
            end.y = start.y + this.fixedHeight - 1;

        this.boxShape(start, end, color);

        this.selected = [];
        if (this.boxCount > MAX_VOXELS_DRAW || this.boxCount == 0)
            return;

        for (let x = this.box.sX; x <= this.box.eX; x++) {
            for (let y = this.box.sY; y <= this.box.eY; y++) {
                for (let z = this.box.sZ; z <= this.box.eZ; z++) {
                    if (!builder.getIndexAtXYZ(x, y, z)) 
                        this.selected.push(Vector3(x, y, z));
                }
            }
        }
    }

    boxSelect(start, end, endNorm, color) {
        if (this.isWorkplane)
            end = endNorm;

        this.boxShape(start, end, color);

        this.selected = [];
        if (this.boxCount > MAX_VOXELS_DRAW || this.boxCount == 0)
            return;

        for (let x = this.box.sX; x <= this.box.eX; x++) {
            for (let y = this.box.sY; y <= this.box.eY; y++) {
                for (let z = this.box.sZ; z <= this.box.eZ; z++) {
                    if (builder.getIndexAtXYZ(x, y, z) > -1)
                        this.selected.push(Vector3(x, y, z));
                }
            }
        }
    }

    getVoxelsFromRectangleSelection(start) {
        const end = { x: scene.pointerX, y: scene.pointerY };
        const bounds = {
            left: Math.min(start.x, end.x),
            top: Math.min(start.y, end.y),
            right: Math.max(start.x, end.x),
            bottom: Math.max(start.y, end.y)
        };

        ui.domMarquee.style.top = `${bounds.top}px`;
        ui.domMarquee.style.left = `${bounds.left}px`;
        ui.domMarquee.style.width = `${bounds.right - bounds.left}px`;
        ui.domMarquee.style.height = `${bounds.bottom - bounds.top}px`;
        
        return builder.voxels.filter((i) => 
            isTargetIn(start, end, i.position, camera.camera0, scene));
    }

    rectSelect(start) {
        this.selected = this.getVoxelsFromRectangleSelection(start);
        this.selected = this.selected.filter((i) => i.visible);
        ghosts.createThin(this.selected);
    }

    rectSelectFirst(start, norm, pick) {
        this.tmp = this.getVoxelsFromRectangleSelection(start);
        this.tmp = this.tmp.filter((i) => i.visible);

        this.selected = [];
        for (let i = 0; i < this.tmp.length; i++) {
            const pos = this.tmp[i].position.add(norm);

            if (!modules.rc.raycast(
                    pos.x, pos.y, pos.z,
                    -pick.ray.direction.x,
                    -pick.ray.direction.y,
                    -pick.ray.direction.z)) {

                this.selected.push({
                    position: pos,
                    color: currentColor,
                    visible: this.tmp[i].visible
                });
            }
        }

        ghosts.createThin(this.selected);
    }

    pickWorkplane(pick, norm) {
        norm.z = Math.round(norm.z * 10) / 10; // fix normal Z

        const pos = pick.pickedPoint.add(Vector3(1, 1, 1)).subtract(Vector3(0.5, 0.5, 0.5)).floor();

        if (norm.x > 0) pos.x = -1;
        if (norm.y > 0) pos.y = -1;
        if (norm.z > 0) pos.z = -1;
        if (norm.x < 0) pos.x = 0;
        if (norm.y < 0) pos.y = 0;
        if (norm.z < 0) pos.z = 0;

        return pos;
    }

    onToolDown(pick) {
        const index = pick.INDEX;
        const norm = pick.NORMAL;
        this.isWorkplane = pick.WORKPLANE;
        this.isSymmetry = symmetry.axis !== -1;

        if (!this.isWorkplane) {
            this.pos = builder.voxels[index].position;
        } else {
            if (!workplaneWhiteList.includes(this.name)) return;
            this.pos = this.pickWorkplane(pick, norm);
        }

        this.posNorm = this.pos.add(norm);

        switch (this.name) {
            case 'add':
                this.add(this.posNorm);
                break;
            case 'remove':
                this.remove(this.pos);
                break;
            case 'paint':
                this.paint(index, this.pos);
                break;
            case 'eyedrop':
                this.eyedrop(builder.voxels[index].color);
                break;
            case 'bucket':
                this.bucket(builder.voxels[index].color);
                break;
            case 'hide_color':
                builder.setVoxelsVisibilityByColor(builder.voxels[index].color, false);
                break;
            case 'isolate_color':
                builder.setVoxelsVisibility(false);
                builder.setVoxelsVisibilityByColor(builder.voxels[index].color, true);
                break;
            case 'delete_color':
                builder.deleteColorAndUpdate(builder.voxels[index].color);
                break;
            case 'box_add':
                this.addNoHelper(this.posNorm); // allow 1 voxel
                this.startBox = this.posNorm;
                this.fixedHeight = parseInt(ui.domBoxToolHeight.value);
                break;
            case 'box_remove':
                this.removeNoHelper(this.pos);
                this.startBox = this.pos;
                if (this.isWorkplane)
                    this.startBox = this.posNorm;
                break;
            case 'box_paint':
                this.selected.push(this.pos);
                this.startBox = this.pos;
                if (this.isWorkplane)
                    this.startBox = this.posNorm;
                break;
            case 'rect_add':
                this.startRect = { x: scene.pointerX, y: scene.pointerY };
                ui.domMarquee.style.display = 'unset';
                break;
            case 'rect_remove':
                this.startRect = { x: scene.pointerX, y: scene.pointerY };
                ui.domMarquee.style.display = 'unset';
                break;
            case 'rect_paint':
                this.startRect = { x: scene.pointerX, y: scene.pointerY };
                ui.domMarquee.style.display = 'unset';
                break;
            case 'transform_box':
                xformer.apply();
                this.selected.push(this.pos);
                this.startBox = this.pos;
                if (this.isWorkplane)
                    this.startBox = this.posNorm;
                break;
            case 'transform_rect':
                xformer.apply();
                this.startRect = { x: scene.pointerX, y: scene.pointerY };
                ui.domMarquee.style.display = 'unset';
                break;
            case 'transform_group':
                xformer.apply();
                xformer.begin(builder.getVoxelsByColor(builder.voxels[index].color));
                break;
            case 'transform_visible':
                xformer.apply();
                xformer.begin(builder.getVoxelsByVisibility(true));
                break;
            case 'measure_volume':
                this.addNoHelper(this.pos); // allow 1 voxel
                this.startBox = this.pos;
                break;
            case 'measure_color':
                ui.notification(`${ builder.getVoxelsByColor(builder.voxels[index].color).length } Voxels`, 5000);
                break;
            case 'bake_color':
                pool.bakeColor(builder.voxels[index].color);
                break;
            case 'frame_color':
                camera.frameColor(builder.voxels[index].color);
                break;
            case 'frame_voxels':
                this.addNoHelper(this.pos); // allow 1 voxel
                this.startBox = this.pos;
                break;
        }
    }

    onToolMove(pick) {
        const index = pick.INDEX;
        const norm = pick.NORMAL;
        this.isWorkplane = pick.WORKPLANE;

        if (!this.isWorkplane) {
            this.pos = builder.voxels[index].position;
        } else {
            if (!workplaneWhiteList.includes(this.name)) return;
            this.pos = this.pickWorkplane(pick, norm);            
        }

        this.posNorm = this.pos.add(norm);

        helper.setOverlayPlane(this.pos.add(norm.scale(0.5)), norm);

        if (!this.isMouseDown) return;

        switch (this.name) {
            case 'add':
                this.add(this.posNorm);
                break;
            case 'remove':
                this.remove(this.pos);
                break;
            case 'paint':
                this.paint(index, this.pos);
                break;
            case 'eyedrop':
                this.eyedrop(builder.voxels[index].color);
                break;
            case 'box_add':
                if (this.startBox)
                    this.boxSelectAdd(this.startBox, this.posNorm, color3FromHex(currentColor));
                break;
            case 'box_remove':
                if (this.startBox)
                    this.boxSelect(this.startBox, this.pos, this.posNorm, COL_ORANGE_RGB);
                break;
            case 'box_paint':
                if (this.startBox)
                    this.boxSelect(this.startBox, this.pos, this.posNorm, color3FromHex(currentColor));
                break;
            case 'rect_add':
                if (this.startRect)
                    this.rectSelectFirst(this.startRect, norm, pick);
                break;
            case 'rect_remove':
                if (this.startRect)
                    this.rectSelect(this.startRect);
                break;
            case 'rect_paint':
                if (this.startRect)
                    this.rectSelect(this.startRect);
                break;
            case 'transform_box':
                if (this.startBox)
                    this.boxSelect(this.startBox, this.pos, this.posNorm, COL_ORANGE_RGB);
                break;
            case 'transform_rect':
                if (this.startRect)
                    this.rectSelect(this.startRect);
                break;
            case 'measure_volume':
                if (this.startBox)
                    this.boxSelect(this.startBox, this.pos, this.posNorm, COL_ORANGE_RGB);
                break;
            case 'frame_voxels':
                if (this.startBox)
                    this.boxSelect(this.startBox, this.pos, this.posNorm, COL_ORANGE_RGB);
                break;
        }
    }

    onToolUp() {
        switch (this.name) {
            case 'add':
                if (this.selected.length > 0) {
                    builder.create();
                    builder.update();
                }
                break;
            case 'remove':
                if (this.selected.length > 0) {
                    for (let i = 0; i < this.selected.length; i++)
                        builder.removeByPosition(this.selected[i]);
                    builder.create();
                    builder.update();
                }
                break;
            case 'paint':
                builder.create();
                builder.update();
                break;
            case 'bucket':
                builder.create();
                builder.update();
                break;
            case 'box_add':
                if (this.selected.length > 0) {
                    this.tmp = builder.createArrayFromNewPositions(this.selected, currentColor, this.isSymmetry);
                    builder.addArray(this.tmp);
                    builder.create();
                    builder.update();
                }
                break;
            case 'box_remove':
                if (this.selected.length > 0) {
                    this.tmp = builder.createArrayFromPositions(this.selected, this.isSymmetry);
                    builder.removeArray(this.tmp);
                    builder.create();
                    builder.update();
                }
                break;
            case 'box_paint':
                if (this.selected.length > 0) {
                    this.tmp = builder.createArrayFromPositions(this.selected, this.isSymmetry);
                    builder.paintByArray(this.tmp, currentColor);
                    builder.create();
                    builder.update();
                }
                break;
            case 'rect_add':
                if (this.selected.length > 0) {
                    builder.addArray(this.selected);
                    builder.create();
                    builder.update();
                }
                break;
            case 'rect_remove':
                if (this.selected.length > 0) {
                    builder.removeArray(this.selected);
                    builder.create();
                    builder.update();
                }
                break;
            case 'rect_paint':
                if (this.selected.length > 0) {
                    builder.paintByArray(this.selected, currentColor);
                    builder.create();
                    builder.update();
                }
                break;
            case 'transform_box':
                if (this.selected.length > 0) {
                    this.tmp = builder.createArrayFromPositions(this.selected, this.isSymmetry);
                    xformer.begin(this.tmp);
                }
                break;
            case 'transform_rect':
                if (this.selected.length > 0)
                    xformer.begin(this.selected);
                break;
            case 'transform_visible':
                if (this.selected.length > 0) {
                    this.tmp = builder.createArrayFromPositions(this.selected, false);
                    xformer.begin(this.tmp);
                }
                break;
            case 'measure_volume':
                if (this.selected.length > 0)
                    (this.selected.length == 1) ? 
                        ui.notification(`X: ${ this.selected[0]._x }, Y: ${ this.selected[0]._y }, Z: ${ this.selected[0]._z }`, 10000):
                        ui.notification(`${ this.selected.length } Voxels`, 8000);
                break;
            case 'frame_voxels':
                if (this.selected.length > 0) {
                    this.tmp = builder.createArrayFromPositions(this.selected, false);
                    camera.frameVoxels(this.tmp);
                }
                break;
        }
    }

    handleToolDown(pickInfo) {
        this.isMouseDown = true;
        if (this.name !== 'camera') {
            if (!builder.isWorking)
                scene.activeCamera.attachControl(canvas, true);
            this.setPickInfo(pickInfo, (p) => {
                scene.stopAnimation(camera.camera0);
                scene.activeCamera.detachControl(canvas);
                this.onToolDown(p);
            });
        }
    }

    handleToolMove(pickInfo) {
        if (this.name !== 'camera') {
            this.now = performance.now();
            this.elapsed = this.now - this.then;
            if (this.elapsed > FPS_TOOL) {
                this.then = this.now - (this.elapsed % FPS_TOOL);
                this.setPickInfo(pickInfo, (p) => {
                    if (!camera.isCameraChange())
                        this.onToolMove(p);
                });
            }
        }
    }

    handleToolUp() {
        this.isMouseDown = false;
        if (this.name !== 'camera') {
            this.onToolUp();

            this.selected = [];
            this.box = { sX: 0, sY: 0, sZ: 0, eX: 0, eY: 0, eZ: 0 };
            this.boxCount = 0;
            this.startBox = null;
            this.startRect = null;
            this.pos = null;
            this.posNorm = null;
            this.tmp = [];
            this.tmpsps = [];

            ghosts.disposeThin();
            ghosts.disposeSPS();
            helper.clearBoxShape();
            setTimeout(() => {
                helper.clearOverlays();
            }, 10); // prevent last overlay in touchscreen

            ui.domMarquee.style = "display: none; left: 0; top: 0; width: 0; height: 0;";
        }
    }

    predicateWorkplane(mesh) {
        if (helper.isFloorPlaneActive && helper.gridPlane.isVisible)
            return mesh == helper.gridPlane;
        if (helper.isWorkplaneActive && helper.workplane.isVisible)
            return mesh == helper.workplane;
        return null;
    }

    predicateSPS(mesh) {
        return mesh == ghosts.spsPick.mesh;
    }

    // Magnetic self-transforming normal probe
    // An unusual way to find a pick-face-normal out of nowhere!
    // This mysterious star-shaped object can stick to surfaces,
    // change its shape like the surfaces, and collect information.
    normalProbe(pick, index, p) {
        this.normal = undefined;

        this.tmpsps = [{ position: p, color: COL_RED, visible: builder.voxels[index].visible }];
        for (let i = 0; i < VEC6_ONE.length; i++) {
            const pos = p.add(VEC6_ONE[i]);
            const idx = builder.getIndexAtPosition(pos);
            if (idx > -1)
                this.tmpsps.push({ position: pos, color: COL_RED, visible: builder.voxels[idx].visible });
        }

        ghosts.createSPSPick(this.tmpsps);
        pick = scene.pick(scene.pointerX, scene.pointerY, this.predicateSPS);
        if (pick && pick.hit)
            this.normal = pick.getNormal(true);

        return this.normal;
    }

    setPickInfo(pick, onHit) {
        const index = builder.getIndexAtPointer();
        if (index > -1) {
            const norm = this.normalProbe(pick, index, builder.voxels[index].position);
            if (norm) {
                pick.INDEX = index;
                pick.NORMAL = norm;
                pick.WORKPLANE = false;
                onHit(pick);
            } else {
                helper.clearOverlays();

                pick = scene.pick(scene.pointerX, scene.pointerY, this.predicateWorkplane);
                if (pick && pick.hit) {
                    pick.INDEX = pick.faceId;
                    pick.NORMAL = pick.getNormal(true);
                    pick.WORKPLANE = true;
                    onHit(pick);
                } else {
                    helper.clearOverlays();
                }
            }
        } else {
            helper.clearOverlays();
        }
    }

    toolSelector(toolName, finishTransforms = false) {
        this.name = toolName;

        const elems = document.getElementsByClassName('tool_' + this.name);
        for (const i of document.querySelectorAll('li'))
            if (i.classList.contains("tool_selector"))
                i.classList.remove("tool_selector");
        for (const i of document.querySelectorAll('button'))
            if (i.classList.contains("tool_selector"))
                i.classList.remove("tool_selector");
        for (let i = 0; i < elems.length; i++)
            elems[i].classList.add("tool_selector");

        if (finishTransforms)
            xformer.apply();

        if (bvhWhiteList.includes(this.name) && !modules.rc.mesh)
            modules.rc.create();

        if (this.name == 'camera' && !builder.isWorking)
            scene.activeCamera.attachControl(canvas, true);

        helper.clearOverlays();
        ui.domInfoTool.innerHTML = `[ ${ this.name.replace('_', ' ').toUpperCase() } ]`;
    }
}


// -------------------------------------------------------
// Tool Mesh


class ToolMesh {
    constructor() {
        this.name = 'select';
        this.selected = [];
    }

    handleToolDown() {
        const pick = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
            return pool.meshes.includes(mesh);
        });

        if (pick && pick.hit) {
            switch (this.name) {
                case 'select':
                    pool.deselectMesh();
                    uix.bindTransformGizmo(pick.pickedMesh);
                    break;
                case 'merge':
                    const idx = this.selected.indexOf(pick.pickedMesh);
                    if (idx == -1) {
                        this.selected.push(pick.pickedMesh);
                        helper.highlightOverlayMesh(pick.pickedMesh, COL_ORANGE_RGB);
                        helper.highlightOutlineMesh(pick.pickedMesh, COL_ORANGE_RGB);
                    } else {
                        this.selected.splice(idx, 1);
                        pick.pickedMesh.renderOverlay = false;
                        pick.pickedMesh.renderOutline = false;
                    }
                    break;
            }
        }
    }

    mergeBakes() {
        if (this.selected.length == 1) {
            ui.notification('pick more meshes ...');
            return;
        }
        
        if (this.selected.length > 1) {
            for (let i = 0; i < this.selected.length; i++) {
                this.selected[i].renderOverlay = false;
                this.selected[i].renderOutline = false;
            }

            pool.mergeBakes(this.selected);

            this.selected = [];
            this.toolSelector('select');
        } else {
            ui.notification('pick meshes to merge');
        }
    }

    cancelSelection() {
        for (let i = 0; i < this.selected.length; i++) {
            this.selected[i].renderOverlay = false;
            this.selected[i].renderOutline = false;
        }
        this.selected = [];
        this.toolSelector('select');
    }

    toolSelector(toolName) {
        this.name = toolName;

        const elems = document.getElementsByClassName('tool_' + this.name);
        for (let i of document.querySelectorAll('li'))
            if (i.classList.contains("tool_mesh_selector"))
                i.classList.remove("tool_mesh_selector");
        for (let i of document.querySelectorAll('button'))
            if (i.classList.contains("tool_mesh_selector"))
                i.classList.remove("tool_mesh_selector");
        for (let i = 0; i < elems.length; i++)
            elems[i].classList.add("tool_mesh_selector");

        pool.deselectMesh();
        uix.unbindTransformGizmo();
    }
}


// -------------------------------------------------------
// Mesh Pool


class MeshPool {
    constructor() {
        this.meshes = [];
        this.selected = null;
        this.pick = null;
    }

    exportOptions = {
        shouldExportNode: (node) => {
            return this.meshes.includes(node);
        }
    }

    exportOptionsSelected = {
        shouldExportNode: (node) => {
            if (ui.domExportSelectedBake.checked && this.selected)
                return this.selected === node;
            return false;
        }
    }
    
    bakeToMesh(voxels = builder.voxels) {
        ui.showProgress(1);
        setTimeout(() => {
            const planes = modules.bakery.bake(voxels);
            const baked = MergeMeshes(planes, true, true);
            baked.overrideMaterialSideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;
            baked.name = '_mesh';
            pool.resetPivot(baked);

            material.setPBRTexture();
            baked.material = material.mat_pbr_msh.clone('_mesh');
            baked.checkCollisions = true;
            baked.receiveShadows = true;

            light.addMesh(baked);
            light.updateShadowMap();

            this.meshes.push(baked);
            this.createMeshList();
            ui.showProgress(0);
        }, 100);
    }

    bake(voxels = undefined) {
        if (ui.domBakeryClear.checked)
            this.clearPool();

        if (ui.domBakerySplit.checked) {
            for (let i = 0; i < palette.uniqueColors.length; i++)
                this.bakeToMesh(builder.getVoxelsByColor(palette.uniqueColors[i]));
        } else {
            (voxels) ? this.bakeToMesh(voxels) : this.bakeToMesh();
        }

        setTimeout(() => {
            if (MODE == 2) {
                if (!ui.domBakerySplit.checked) {
                    uix.bindTransformGizmo(this.meshes[this.meshes.length-1]);
                    uix.gizmo.attachToMesh(this.meshes[this.meshes.length-1]);
                }
            } else {
                pool.setPoolVisibility(false);
                ui.notification('baked');
            }
        }, 200);
    }

    bakeColor(hex) {
        if (ui.domBakeryClear.checked)
            this.clearPool();
        
        this.bakeToMesh(builder.getVoxelsByColor(hex));

        setTimeout(() => {
            pool.setPoolVisibility(false);
            ui.notification('baked');
        }, 200);
    }

    cloneSelected() {
        if (this.selected) {
            const clone = this.selected.clone('_clone');
            clone.makeGeometryUnique();
            clone.material = this.selected.material.clone('_clone');

            clone.checkCollisions = true;
            clone.receiveShadows = true;
            light.addMesh(clone);
            light.updateShadowMap();

            uix.bindTransformGizmo(clone);
            uix.gizmo.attachToMesh(clone);
            helper.highlightOverlayMesh(clone, COL_ORANGE_RGB);

            this.meshes.push(clone);
            this.createMeshList();
            this.meshListSelect(clone);
        } else {
            ui.notification('select a mesh');
        }
    }

    async mergeAll() {
        if (this.meshes.length > 0) {
            if (!await ui.showConfirm('merge all baked meshes?')) return;

            const mesh = MergeMeshes(this.meshes, true, true);
            pool.resetPivot(mesh);
            mesh.name = '_merged';

            this.clearMeshArray();

            material.setPBRTexture();
            mesh.material = material.mat_pbr_msh.clone('_merged');

            mesh.checkCollisions = true;
            mesh.receiveShadows = true;
            light.addMesh(mesh);
            light.updateShadowMap();

            uix.bindTransformGizmo(mesh);
            uix.gizmo.attachToMesh(mesh);
            
            this.meshes.push(mesh);
            this.createMeshList();
        }
    }

    mergeBakes(bakes) {
        const mesh = MergeMeshes(bakes, true, true);
        pool.resetPivot(mesh);
        mesh.name = '_merged';

        for (let i = 0; i < bakes.length; i++) {
            this.meshes.splice(this.meshes.indexOf(bakes[i]), 1);
            if (bakes[i].material) {
                if (bakes[i].material.albedoTexture)
                    bakes[i].material.albedoTexture.dispose();
                bakes[i].material.dispose();
            }
            bakes[i].dispose();
        }

        material.setPBRTexture();
        mesh.material = material.mat_pbr_msh.clone('_merged');

        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        light.addMesh(mesh);
        light.updateShadowMap();

        uix.bindTransformGizmo(mesh);
        uix.gizmo.attachToMesh(mesh);
        
        this.meshes.push(mesh);
        this.createMeshList();
    }

    async deleteSelected() {
        if (this.selected) {
            if (!await ui.showConfirm('delete selected bake?')) return;

            this.meshes.splice(this.meshes.indexOf(this.selected), 1);
            if (this.selected.material.albedoTexture)
                this.selected.material.albedoTexture.dispose();
            this.selected.material.dispose();
            this.selected.dispose();
            this.selected = null;
            this.createMeshList();
            uix.unbindTransformGizmo();
            light.updateShadowMap();
        } else {
            ui.notification('select a mesh');
        }
    }

    selectMesh(mesh) {
        this.selected = mesh;
        this.meshListSelect(mesh);
        helper.highlightOutlineMesh(mesh, COL_ORANGE_RGBA);
    }

    deselectMesh() {
        this.selected = null;
        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].renderOverlay = false;
            this.meshes[i].renderOutline = false;
        }
        this.meshListDeselect();
    }

    onGizmoAttached(mesh) {
        this.deselectMesh(); // on user select
        this.selectMesh(mesh);
        this.getMaterial();
    }

    resetRotation() {
        if (this.selected) {
            this.selected.rotation = Vector3(0, 0, 0);
            light.updateShadowMap();
        } else {
            ui.notification('select a mesh');
        }
    }

    setPoolVisibility(isVisible) {
        for (let i = 0; i < this.meshes.length; i++)
            this.meshes[i].isVisible = isVisible;
    }

    async clearPool(isAlert = false) {
        if (this.meshes.length > 0) {
            if (isAlert && !await ui.showConfirm('clear all baked meshes?')) return;
            this.clearMeshArray();
            this.selected = null;
            this.createMeshList();
            uix.unbindTransformGizmo();
            light.updateShadowMap();
        }
    }
    
    getMaterial() {
        if (this.selected) {
            currentColorBake = this.selected.material.albedoColor.toHexString();
            ui.domRoughness.value = this.selected.material.roughness;
            ui.domMetallic.value = this.selected.material.metallic;
            ui.domAlpha.value = this.selected.material.alpha;
            ui.domColorPickerAlbedo.value = this.selected.material.albedoColor.toHexString();
            ui.domColorPickerEmissive.value = this.selected.material.emissiveColor.toHexString();
        } else {
            ui.notification('select a mesh');
        }
    }

    setMaterial(type) {
        if (this.selected) {
            switch (type) {
                case 'roughness':
                    this.selected.material.roughness = parseFloat(ui.domRoughness.value);
                    break;
                case 'metallic':
                    this.selected.material.metallic = parseFloat(ui.domMetallic.value);
                    break;
                case 'alpha':
                    this.selected.material.alpha = parseFloat(ui.domAlpha.value);
                    this.selected.visibility = parseFloat(ui.domAlpha.value); // alpha seth!
                    break;
                case 'albedo':
                    this.selected.material.albedoColor = color3FromHex(currentColorBake);
                    break;
                case 'emissive':
                    this.selected.material.emissiveColor = color3FromHex(ui.domColorPickerEmissive.value);
                    break;
            }
        }
    }

    replaceTexture() {
        if (this.selected && this.selected.material) {
            if (this.selected.material.albedoTexture)
                this.selected.material.albedoTexture.dispose();
            this.selected.material.albedoTexture = material.textures[material.texId].clone();
        }
    }

    updateReflectionTextures() {
        for (let i = 0; i < this.meshes.length; i++) {
            if (this.meshes[i].material.reflectionTexture)
                this.meshes[i].material.reflectionTexture.dispose();
            this.meshes[i].material.reflectionTexture = hdri.hdrMap.clone();
            this.meshes[i].material.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
        }
    }

    updateVertexColors(hex = '#FFFFFF') {
        if (this.selected) {
            const colors = [];
            const rgb = color3FromHex(hex).toLinearSpace();
            const positions = this.selected.getVerticesData(PositionKind);
            for (let i = 0; i < positions.length/3; i++) {
                colors.push(rgb.r, rgb.g, rgb.b, 1);
            }
            this.selected.setVerticesData(ColorKind, colors);
        } else {
            ui.notification('select a mesh');
        }
    }

    createMeshList() {
        ui.domMeshList.innerHTML = "";
        for (let i = 0; i < this.meshes.length; i++) {
            const item = document.createElement('div');
            const name = document.createElement('div');
            name.classList.add('item_name');
            name.innerHTML = this.meshes[i].name;
            name.spellcheck = false;
            item.onclick = () => {
                this.deselectMesh();
                this.selectMesh(this.meshes[i]);
                uix.bindTransformGizmo(this.meshes[i]);
                uix.gizmo.attachToMesh(this.meshes[i]);
            };
            item.onkeyup = () => {
                this.meshes[i].name = name.innerHTML;
            };
            item.onpaste = (ev) => {
                ev.preventDefault();
                name.innerHTML = ev.clipboardData.getData('Text');
                this.meshes[i].name = name.innerHTML;
            };
            item.ondblclick = () => {
                name.contentEditable = true;
                name.classList.add('ignorekeys');
            };
            item.onblur = () => {
                name.contentEditable = false;
                name.classList.remove('ignorekeys');
            };
            item.appendChild(name);
            ui.domMeshList.appendChild(item);
        }
    }

    meshListSelect(mesh) {
        let idx = -1;
        for (let i = 0; i < this.meshes.length; i++)
            if (this.meshes[i] === mesh)
                idx = i;
        
        if (ui.domMeshList.children[idx]) {
            for (const i of ui.domMeshList.children)
                i.firstChild.classList.remove("mesh_select");
            ui.domMeshList.children[idx].firstChild.classList.add('mesh_select');
        }
    }

    meshListDeselect() {
        for (const i of ui.domMeshList.children)
            i.firstChild.classList.remove("mesh_select");
    }

    loadMesh(url) {
        LoadAssetContainerAsyncFromData(url, '.glb', scene, (container) => {
            let count = 0;
            for (let i = 0; i < container.meshes.length; i++) {
                if (container.meshes[i].name !== '__root__') {
                    const baked = container.meshes[i].clone(container.meshes[i].name);
                    this.normalizeMeshGLTF(baked, container.meshes[i].material.clone(container.meshes[i].name));
                    this.meshes.push(baked);
                    count += 1;
                }
            }
            container.removeAllFromScene();

            if (count == 0) {
                ui.errorMessage('unable to load baked meshes');
            } else {
                if (MODE !== 2)
                    this.setPoolVisibility(false);
                this.updateReflectionTextures();
                this.createMeshList();
                light.updateShadowMap();
            }
        }, (err) => {
            ui.errorMessage('unable to load baked meshes');
            console.error(err);
        })
    }

    constructPlane(positions, normals, uvs, indices, hex) {
        //BABYLON.VertexData.ComputeNormals(positions, indices, normals, { useRightHandedSystem: true });
        const col = hexToRgbFloat(hex, 2.2);
        const mesh = new BABYLON.Mesh('plane', scene);
        const vertexData = new BABYLON.VertexData();
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        vertexData.indices = indices;
        vertexData.colors = [
            col.r, col.g, col.b, 1,
            col.r, col.g, col.b, 1,
            col.r, col.g, col.b, 1,
            col.r, col.g, col.b, 1
        ];
        vertexData.applyToMesh(mesh);
        return mesh;
    }

    clearMeshArray() {
        scene.blockfreeActiveMeshesAndRenderingGroups = true; // save unnecessary
        for (let i = 0; i < this.meshes.length; i++) { // dispose() computation
            if (this.meshes[i].material.albedoTexture)
                this.meshes[i].material.albedoTexture.dispose();
            if (this.meshes[i].material.reflectionTexture)
                this.meshes[i].material.reflectionTexture.dispose();
            this.meshes[i].material.dispose();
            this.meshes[i].dispose();
        }
        scene.blockfreeActiveMeshesAndRenderingGroups = false;
        this.meshes = [];
    }

    normalizeMesh(mesh, scale) {
        const bounds = mesh.getBoundingInfo();
        const size = Vector3(
            Math.abs(bounds.minimum.x - bounds.maximum.x),
            Math.abs(bounds.minimum.y - bounds.maximum.y),
            Math.abs(bounds.minimum.z - bounds.maximum.z));
    
        const scaleFactor = Math.min(scale / size.x, scale / size.y, scale / size.z);
        const scaleMatrix = MatrixScaling(scaleFactor, scaleFactor, scaleFactor);
    
        const centerX = -bounds.boundingBox.center.x + size.x / 2;
        const centerY = size.y / 2 - bounds.boundingBox.center.y;
        const centerZ = -bounds.boundingBox.center.z + size.z / 2;
        const tMatrix = MatrixTranslation(centerX, centerY, centerZ);
    
        mesh.bakeTransformIntoVertices(tMatrix.multiply(scaleMatrix));
    }

    normalizeMeshGLTF(mesh, material) {
        mesh.setParent(null);
        mesh.metadata = null;

        // set side-orientation to right handed system
        mesh.overrideMaterialSideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;

        mesh.material = material;
        mesh.visibility = mesh.material.alpha; // reload alpha seth!
        
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        light.addMesh(mesh);
    }

    resetPivot(mesh) {
        const center = mesh.getBoundingInfo().boundingSphere.centerWorld;
        mesh.setPivotMatrix(MatrixTranslation(-center.x, -center.y, -center.z), false);
        mesh.bakeCurrentTransformIntoVertices();
        mesh.setPivotMatrix(MatrixIdentity());
        mesh.position = center;
        mesh.refreshBoundingInfo();
    }
}


// -------------------------------------------------------
// Snapshot


const vbstoreVoxels = 'vbstore_voxels';
const vbstoreSnapshots = 'vbstore_voxels_snap';
const vbstoreSnapshotsImages = 'vbstore_voxels_snap_img';

class Snapshot {
    constructor() {
        this.shots = document.querySelectorAll('li.storage');

        this.createSnapshots();

        // free resources, no quicksave for baked meshes after 4.4.4
        localStorage.removeItem('vbstore_bakes');
    }

    setStorageVoxels(name = vbstoreVoxels) {
        try {
            localStorage.setItem(name, builder.getData());
        } catch (err) {
            ui.errorMessage('error: quota exceeded')
        }
    }

    getStorageVoxels(name = vbstoreVoxels) {
        const data = localStorage.getItem(name);
        if (!data) {
            ui.notification("empty storage");
            return;
        }
        builder.setData(data);
        project.clearScene(true);
    }

    delStorage(name) {
        if (localStorage.getItem(name))
            localStorage.removeItem(name);
    }

    createSnapshots() {
        for (let i = 0; i < this.shots.length; i++) {
            const img = this.shots[i].children[0];
            const save = this.shots[i].children[1].lastChild;
            const clear = this.shots[i].children[1].firstChild;

            img.src = SNAPSHOT;
            img.id = 'shot' + i;

            // restore previous on startup
            const data = localStorage.getItem(vbstoreSnapshotsImages + img.id);
            if (data) img.src = data;

            clear.addEventListener("click", async () => {
                if (MODE !== 0 || img.src !== SNAPSHOT && !await ui.showConfirm('delete snapshot?')) return;
                img.src = SNAPSHOT;
                this.delStorage(vbstoreSnapshots + img.id);
                this.delStorage(vbstoreSnapshotsImages + img.id);
            }, false);

            save.addEventListener("click", async () => {
                if (MODE !== 0 || img.src !== SNAPSHOT && !await ui.showConfirm('save new snapshot?')) return;
                project.createScreenshotBasic(img.clientWidth, img.clientHeight, (data) => {
                    this.setStorageVoxels(vbstoreSnapshots + img.id);
                    const isOk = localStorage.getItem(vbstoreSnapshots + img.id);
                    if (isOk) {
                        localStorage.setItem(vbstoreSnapshotsImages + img.id, data);
                        img.src = data;
                    }
                });
            }, false);

            img.addEventListener("click", async () => {
                if (img.src !== SNAPSHOT && !await ui.showConfirm('load snapshot?')) return;
                ui.setMode(0);
                this.getStorageVoxels(vbstoreSnapshots + img.id);
            }, false);

            img.addEventListener("dragstart", (ev) => {
                ev.preventDefault();
            }, false);
        }
    }
}


// -------------------------------------------------------
// Memory


class Memory {
    constructor() {
        this.stack = [];
        this.block = -1;
    }

    record(current) {
        if (this.stack[this.block] !== current) {   // not detect all changes
            this.stack[++this.block] = current;
            this.stack.splice(this.block + 1);      // delete anything forward
        }
    }

    undo() {
        --this.block;
        if (this.stack[this.block]) {
            builder.setData(this.stack[this.block]);
        } else {
            ++this.block;
        }
    }

    redo() {
        ++this.block;
        if (this.stack[this.block]) {
            builder.setData(this.stack[this.block]);
        } else {
            --this.block;
        }
    }

    reset() {
        this.stack[++this.block] = builder.getData();
        this.stack.splice(this.block + 1);
    }

    clear() {
        this.stack = [];
        this.block = -1;
        this.reset(); // init memory block 0
    }
}


// -------------------------------------------------------
// Project


class Project {
    constructor() {}

    serializeScene(voxels, meshes) {
        const json = {
            version: "Voxel Builder 4.4.6",
            project: {
                name: "name",
                voxels: builder.voxels.length,
                meshes: pool.meshes.length
            },
            scene: { // TODO
                bgcolor: "#FFFFFF",
                lightcolor: "#FFFFFF"
            },
            data: {
                voxels: "",
                meshes: ""
            }
        };
        json.project.name = ui.domProjectName.value;
        json.scene.bgcolor = ui.domColorPickerBackground.value.toUpperCase();
        json.scene.lightcolor = ui.domColorPickerLightColor.value.toUpperCase();
        json.data.voxels = voxels;
        json.data.meshes = meshes;
        return json;
    }

    updateScene(data) {
        if (data.bgcolor) {
            this.setProjectValues(ui.domColorPickerBackground, data.bgcolor, '#6C6F7A');
        }
        if (data.lightcolor) {
            this.setProjectValues(ui.domColorPickerLightColor, data.lightcolor, '#CCCCCC');
            light.updateColor(ui.domColorPickerLightColor.value);
        }
    }
    
    clearSceneAndReset() {
        ui.setMode(0);
        this.clearScene();
    
        scene.clearColor = color4FromHex(DEF_BGCOLOR);
        scene.autoClear = false;
        
        tool.toolSelector('camera');
        helper.enableFloorPlane(false);
        helper.enableWorkplane(false);
        light.updateColor(DEF_LIGHTCOLOR);
        pool.clearPool();
        uix.hideLightLocator();
    
        ui.domColorPickerLightColor.value = DEF_LIGHTCOLOR;
        ui.domColorPickerBackground.value = DEF_BGCOLOR;
        ui.domBackgroundCheck.checked = false;
    }

    clearScene(frameCamera = true) {
        memory.clear();
        symmetry.resetAxis();
        if (frameCamera)
            setTimeout(() => {
                camera.frame();
            }, 10);
    }

    async newProject() {
        if (!await ui.showConfirm('create new project?')) return;
        modules.generator.newBox(1, COL_ICE);
        builder.create();
        this.clearSceneAndReset();
        ui.domProjectName.value = 'untitled';
    }

    newProjectStartup(size = 20) {
        builder.voxels = [];
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    builder.add(Vector3(x, y, z), COL_ICE, true);
                }
            }
        }
        builder.create();
        this.clearScene();
        ui.setMode(0);
        ui.domProjectName.value = 'untitled';
    }

    save() {
        const json = this.serializeScene(builder.getDataString(), "");

        if (pool.meshes.length > 0) {
            ExportGLB(scene, ui.domProjectName.value, pool.exportOptions, false, (data) => {
                const blob = data.glTFFiles[ `${ui.domProjectName.value}.glb` ];
                const file = new File([ blob ], `${ui.domProjectName.value}.glb`);
                const reader = new FileReader();
                reader.onload = () => {
                    json.data.meshes = reader.result;
                    downloadJson(JSON.stringify(json, null, 4), `${ui.domProjectName.value}.json`);
                }
                reader.readAsDataURL(file);
            });
        } else {
            downloadJson(JSON.stringify(json, null, 4), `${ui.domProjectName.value}.json`);
        }
    }

    load(data) {
        data = JSON.parse(data);
        
        // project
        ui.domProjectName.value = data.project.name;

        // scene
        if (data.scene)
            this.updateScene(data.scene)

        // data.voxels
        builder.setDataFromString(data.data.voxels);
        this.clearSceneAndReset();

        // data.meshes
        if (data.data.meshes) {
            pool.clearPool(false);
            pool.loadMesh(data.data.meshes);
        } else if (data.data.bakes) { // backward compatibity
            pool.clearPool(false);
            pool.loadMesh(data.data.bakes);
        } else {
            pool.clearPool(false);
        }
    }

    importVoxels(data) {
        ui.setMode(0);
        
        const voxels = JSON.parse(data).data.voxels.split(';').slice(0, -1);
        for (let i = 0; i < voxels.length; i++) {
            const chunk = voxels[i].split(',');
            builder.add(Vector3(
                    parseFloat(chunk[0]),
                    parseFloat(chunk[1]),
                    parseFloat(chunk[2])
                ),
                chunk[3].toUpperCase(),
                parseBool(chunk[4]));
        }
        
        builder.create();
        builder.update();
        this.clearScene(true);
    }

    importBakes(data) {
        ui.setMode(2);

        data = JSON.parse(data);
        if (data.data.meshes) {
            pool.loadMesh(data.data.meshes);
        } else {
            ui.notification('no baked meshes');
        }
    }

    exportVoxels() {
        const mesh = builder.createMesh();

        const options = {
            shouldExportNode: (node) => {
                return node === mesh;
            }
        }

        switch (ui.domExportFormat.value) {
            case 'glb':
                ExportGLB(scene, ui.domProjectName.value, options, true, () => {
                    mesh.dispose();
                });
                break;
            case 'gltf':
                ExportGLTF(scene, ui.domProjectName.value, options, () => {
                    mesh.dispose();
                });
                break;
            case 'obj':
                downloadBlob(new Blob([ ExportOBJ([ mesh ]) ], { type: "octet/stream" }), `${ui.domProjectName.value}.obj`);
                mesh.dispose();
                break;
            case 'stl':
                ExportSTL([ mesh ], ui.domProjectName.value);
                mesh.dispose();
                break;
        }
    }

    exportBakes() {
        if (pool.meshes.length == 0) {
            ui.notification('no baked meshes');
            return;
        }
        if (ui.domExportSelectedBake.checked && !pool.selected) {
            ui.notification('select a mesh');
            return;
        }

        let exports = pool.exportOptions;
        if (ui.domExportSelectedBake.checked && pool.selected)
            exports = pool.exportOptionsSelected;

        if (ui.domExportFormat.value == 'obj' || ui.domExportFormat.value == 'stl') {
            if (ui.domExportSelectedBake.checked && pool.selected) {
                exports = [ pool.selected ];
            } else {
                exports = pool.meshes;
            }
        }

        switch (ui.domExportFormat.value) {
            case 'glb':
                ExportGLB(scene, ui.domProjectName.value, exports, true, () => { });
                break;
            case 'gltf':
                ExportGLTF(scene, ui.domProjectName.value, exports, () => { });
                break;
            case 'obj':
                downloadBlob(new Blob([ ExportOBJ(exports) ], { type: "octet/stream" }), `${ui.domProjectName.value}.obj`);
                break;
            case 'stl':
                ExportSTL(exports, ui.domProjectName.value);
                break;
        }
    }

    loadFromUrl(url, onLoad = undefined) {
        if (url === '') return;
        fetch(url).then(res => {
            if (res.status === 200) {
                res.text().then(data => {
                    this.load(data);
                    if (onLoad) onLoad();
                });
            }
        }).catch(err => {
            //
        });
    }

    async loadMagicaVoxel(buffer) {
        ui.showProgress(1);
        const msg = await modules.workerPool.postMessage({ id: 'parseMagicaVoxel', data: buffer });
        if (msg) {
            const voxels = [];
            for (let i = 0; i < msg.data.length; i++) {
                voxels.push({ 
                    position: Vector3(msg.data[i].x, msg.data[i].y, msg.data[i].z),
                    color: msg.data[i].color,
                    visible: true
                });
            }
            builder.setDataFromArray(voxels, true);
            builder.normalizeVoxelPositions(false);
            this.clearSceneAndReset();
            ui.domProjectName.value = 'untitled';
            ui.showProgress(0);
        } else {
            ui.errorMessage('incompatible vox file');
            ui.showProgress(0);
        }
    }

    createScreenshot(scale = 4) {
        if (modules.sandbox.isActive()) {
            modules.sandbox.shot();
        } else {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            engine.engine.setSize(canvasWidth * scale, canvasHeight * scale);
            isRenderAxisView = false;
            uix.colorPicker.isVisible = false;
            BABYLON.ScreenshotTools.CreateScreenshotWithResizeAsync(engine.engine,
                scene.activeCamera, canvasWidth * scale, canvasHeight * scale).then(() => {
                    isRenderAxisView = true;
                    uix.colorPicker.isVisible = (MODE == 0);
                    engine.engine.setSize(canvasWidth, canvasHeight);
            });
        }
    }
    
    createScreenshotBasic(width, height, callback) {
        isRenderAxisView = false;
        uix.colorPicker.isVisible = false;
        BABYLON.ScreenshotTools.CreateScreenshot(engine.engine,
            scene.activeCamera, { width: width, height: height }, (data) => {
                isRenderAxisView = true;
                uix.colorPicker.isVisible = (MODE == 0);
                callback(data);
        });
    }

    setProjectValues(uiDom, iniKey, defVal) {
        (iniKey) ? uiDom.value = iniKey : uiDom.value = defVal;
    }
}


// -------------------------------------------------------
// UserInterface


class UserInterface {
    constructor() {
        this.domToolbarL = document.getElementById('toolbar_L');
        this.domToolbarC = document.getElementById('toolbar_C');
        this.domToolbarC_mem = document.getElementById('toolbar_C_mem');
        this.domModes = document.querySelectorAll('#toolbar_C li.mode');
        this.domMenus = document.getElementById('menus');
        this.domMenuInScreenLeft = document.getElementById('menu-inscreen-left');
        this.domMenuInScreenRight = document.getElementById('menu-inscreen-right');
        this.domMenuInScreenBottom = document.getElementById('menu-inscreen-bottom');
        this.domInScreenSymmAxis = document.getElementById('btn-inscreen-symmetry');
        this.domInScreenOrtho = document.getElementById('btn-inscreen-ortho');
        this.domInScreenGridPlane = document.getElementById('btn-inscreen-gridplane');
        this.domInScreenWorkplane = document.getElementById('btn-inscreen-workplane');
        this.domInScreenLightLocator = document.getElementById('btn-inscreen-lightlocator');
        this.domSandboxRender = document.getElementById('sandbox_render');
        this.domSymmAxisS = document.getElementById('btn-symm-axis-s');
        this.domSymmAxisX = document.getElementById('btn-symm-axis-x');
        this.domSymmAxisY = document.getElementById('btn-symm-axis-y');
        this.domSymmAxisZ = document.getElementById('btn-symm-axis-z');
        this.domSymmCenter = document.getElementById('input-symm-center');
        this.domPalette = document.getElementById('palette');
        this.domPaletteColors = document.getElementById('palette-colors');
        this.domMeshList = document.getElementById('meshlist');
        this.domHover = document.getElementById('hover');
        this.domMarquee = document.getElementById("marquee");
        this.domBoxToolHeight = document.getElementById('input-boxtool-height');
        this.domHdriBackground = document.getElementById('input-hdri-background');
        this.domHdriBlur = document.getElementById('input-hdri-blur');
        this.domCameraFov = document.getElementById('input-camera-fov');
        this.domCameraFStop = document.getElementById('input-camera-fstop');
        this.domCameraFocalLength = document.getElementById('input-camera-focal');
        this.domRenderBtn = document.getElementById('tab-render');
        this.domTransformClone = document.getElementById('input-transform-clone');
        this.domVoxelizerScale = document.getElementById('input-voxelizer-scale');
        this.domVoxelizerRatio = document.getElementById('input-voxelizer-ratio');
        this.domVoxelizerYup = document.getElementById('input-voxelizer-yup');
        this.domToolBakeColor = document.getElementsByClassName('tool_bake_color')[0];
        this.domBakerySplit = document.getElementById('input-bakery-split');
        this.domBakeryClear = document.getElementById('input-bakery-clear');
        this.domBakeryBackface = document.getElementById('input-bakery-backface');
        this.domAutoRotation = document.getElementById('input-autorotate');
        this.domAutoRotationCCW = document.getElementById('input-autorotate-ccw');
        this.domRoughness = document.getElementById('input-material-roughness');
        this.domRoughnessRange = document.getElementById('input-material-roughness-range');
        this.domMetallic = document.getElementById('input-material-metallic');
        this.domMetallicRange = document.getElementById('input-material-metallic-range');
        this.domAlpha = document.getElementById('input-material-alpha');
        this.domAlphaRange = document.getElementById('input-material-alpha-range');
        this.domBackgroundCheck = document.getElementById('input-env-bgcheck');
        this.domColorPicker = document.getElementById('input-color');
        this.domColorPickerBackground = document.getElementById('input-env-background');
        this.domColorPickerAlbedo = document.getElementById('input-material-albedo');
        this.domColorPickerEmissive = document.getElementById('input-material-emissive');
        this.domColorPickerLightColor = document.getElementById('input-light-color');
        this.domColorPickerVertexColor = document.getElementById('input-vertex-color');
        this.domLightIntensity = document.getElementById('input-light-intensity');
        this.domLightShadows = document.getElementById('input-light-shadows');
        this.domMaterialSwitch = document.getElementById('material-switch');
        this.domProjectName = document.getElementById('input-project-name');
        this.domExportFormat = document.getElementById('input-export-format');
        this.domExportSelectedBake = document.getElementById('input-export-selbake');
        this.domOrthoBtn = document.getElementById('btn-ortho');
        this.domRenderShade = document.getElementById('input-pt-shade');
        this.domRenderFast = document.getElementById('input-pt-fast');
        this.domRenderPause = document.getElementById('btn-pt-pause');
        this.domRenderShot = document.getElementById('btn-pt-shot');
        this.domRenderMaxSamples = document.getElementById('input-pt-maxsamples');
        this.domRenderBounces = document.getElementById('input-pt-bounces');
        this.domRenderDPR = document.getElementById('input-pt-dpr');
        this.domRenderTiles = document.getElementById('input-pt-tiles');
        this.domRenderEnvPower = document.getElementById('input-pt-envpower');
        this.domRenderAutoStart = document.getElementById('input-pt-autostart');
        this.domRenderGrid = document.getElementById('input-pt-grid');
        this.domRenderMaterialRoughness = document.getElementById('input-pt-roughness');
        this.domRenderMaterialMetalness = document.getElementById('input-pt-metalness');
        this.domRenderMaterialTransmission = document.getElementById('input-pt-transmission');
        this.domConfirm = document.getElementById('confirm');
        this.domConfirmBlocker = document.getElementById('confirmblocker');
        this.domNotifier = document.getElementById('notifier');
        this.domInfo = document.getElementById('info').children;
        this.domInfoParent = document.getElementById('info');
        this.domInfoTool = document.getElementById('info_tool');
        this.domInfoRender = document.getElementById('info_render');
        this.domProgressBar = document.getElementById('progressbar');
        this.domWebSocketStatus = document.getElementById('ws_status');
        this.domPixelEyedropper = document.getElementById('activate_pixeleyedrop');
        this.domDevMode = document.getElementById('devmode');
        
        this.hoverOffset = { x: 0, y: 0 };
        this.panels = [];
        this.lastIndex = 1000;
        this.notificationTimer = null;

        this.eyeDropper = undefined;
        if (window.EyeDropper) {
            this.eyeDropper = new EyeDropper();
            this.domPixelEyedropper.disabled = false;
        }
        this.abortController = new AbortController();

        this.registerPanels();
        this.registerToolbarButtons();
    }

    showProgress(val, max = undefined) {
        if (max === undefined) max = val;
        setTimeout(() => {
            this.domProgressBar.style.width = ~~Math.abs((val / max) * 100) + '%';
        }, 10);
    }

    setMode(mode) {
        if (preferences.isInitialized && MODE == mode) return;
        MODE = mode;

        helper.clearOverlays();
        ghosts.disposePointCloud();
        tool.toolSelector('camera');
        toolMesh.toolSelector('select');
        uix.unbindTransformGizmo();
        modules.sandbox.deactivate();

        if (mode == 0) {
            builder.setMeshVisibility(true);
            pool.setPoolVisibility(false);
            light.updateShadowMap();
        } else if (mode == 1) {
            modules.sandbox.activate();
        } else if (mode == 2) {
            builder.setMeshVisibility(false);
            pool.setPoolVisibility(true);
            pool.createMeshList();
            light.updateShadowMap();
            if (preferences.getPointCloud())
                ghosts.createPointCloud();
        }

        this.setInterfaceMode(mode);
    }

    setInterfaceMode(mode) {
        this.domToolbarC_mem.children[0].style.display = 'unset';
        this.domToolbarC_mem.children[1].style.display = 'unset';
        this.domToolbarC_mem.children[2].style.display = 'unset'; // spacer
        this.domToolbarC_mem.children[3].style.display = 'unset';
        this.domToolbarC_mem.children[4].style.display = 'unset';
        this.domPalette.style.display = 'none';
        this.domMeshList.style.display = 'none';
        this.domHover.style.display = 'unset';
        this.domMenuInScreenLeft.style.display = 'flex';
        this.domMenuInScreenRight.style.display = 'none';
        this.domSandboxRender.style.display = 'none';
        this.domInfoTool.style.display = 'none';

        for (const i of this.domToolbarL.children) {
            i.style.display = 'unset';
            i.firstChild.disabled = false;
        }
            
        if (mode == 0) {
            this.domPalette.style.display = 'unset';
            this.domMenuInScreenRight.style.display = 'flex';
            this.domInfoTool.style.display = 'unset';
            this.domToolbarL.children[14].firstChild.disabled = true; // MESHES
            this.domToolbarL.children[15].firstChild.disabled = true; // MATERIAL
            uix.colorPicker.isVisible = true;
        } else if (mode == 1) {
            this.domHover.style.display = 'none';
            this.domToolbarL.children[5].style.display = 'none';  // STORAGE
            this.domToolbarL.children[6].style.display = 'none';  // IMPORT
            this.domToolbarL.children[7].style.display = 'none';  // CREATE
            this.domToolbarL.children[8].style.display = 'none';  // SYMM
            this.domToolbarL.children[9].style.display = 'none';  // MODEL
            this.domToolbarL.children[10].style.display = 'none'; // PAINT
            this.domToolbarL.children[11].style.display = 'none'; // VOXELS
            this.domToolbarL.children[12].style.display = 'none'; // GROUPS
            this.domToolbarL.children[13].style.display = 'none'; // BAKERY
            this.domToolbarL.children[14].style.display = 'none'; // MESHES
            this.domToolbarL.children[15].style.display = 'none'; // MATERIAL
            this.domMenuInScreenLeft.style.display = 'none';
            this.domSandboxRender.style.display = 'flex';
        } else if (mode == 2) {
            this.domMeshList.style.display = 'unset';
            this.domHover.style.display = 'none';
            this.domToolbarL.children[5].firstChild.disabled = true;  // STORAGE
            this.domToolbarL.children[6].firstChild.disabled = true;  // IMPORT
            this.domToolbarL.children[7].firstChild.disabled = true;  // CREATE
            this.domToolbarL.children[8].firstChild.disabled = true;  // SYMM
            this.domToolbarL.children[9].firstChild.disabled = true;  // MODEL
            this.domToolbarL.children[10].firstChild.disabled = true; // PAINT
            this.domToolbarL.children[11].firstChild.disabled = true; // VOXELS
            this.domToolbarL.children[12].firstChild.disabled = true; // GROUPS
            uix.colorPicker.isVisible = false;
        }

        for (const i of this.domModes)
            i.classList.remove("mode_select");
        this.domModes[mode].classList.add("mode_select");

        this.setToolbarMem(mode);
    }

    setToolbarMem(mode) {
        if (mode == 0) {
            this.domToolbarC_mem.children[0].onclick = () => { snapshot.setStorageVoxels() };
            this.domToolbarC_mem.children[1].onclick = () => { snapshot.getStorageVoxels() };
            this.domToolbarC_mem.children[3].onclick = () => { memory.undo() };
            this.domToolbarC_mem.children[4].onclick = () => { memory.redo() };
            this.domToolbarC_mem.children[0].innerHTML = 'SAVE';
            this.domToolbarC_mem.children[1].innerHTML = 'LOAD';
            this.domToolbarC_mem.children[3].innerHTML = 'UNDO';
            this.domToolbarC_mem.children[4].innerHTML = 'REDO';
        } else if (mode == 1) {
            this.domToolbarC_mem.children[0].onclick = () => { modules.sandbox.toggleAutoStart() };
            this.domToolbarC_mem.children[1].onclick = () => { modules.sandbox.toggleFastMode() };
            this.domToolbarC_mem.children[3].onclick = () => { modules.sandbox.togglePause() };
            this.domToolbarC_mem.children[4].onclick = () => { modules.sandbox.shot() };
            this.domToolbarC_mem.children[0].innerHTML = 'AUTO';
            this.domToolbarC_mem.children[1].innerHTML = 'FAST';
            this.domToolbarC_mem.children[3].innerHTML = 'PAUSE';
            this.domToolbarC_mem.children[4].innerHTML = 'SHOT';
        } else if (mode == 2) {
            this.domToolbarC_mem.children[0].onclick = async () => { if (await ui.showConfirm('start the baking process?')) pool.bake() };
            this.domToolbarC_mem.children[1].onclick = () => { modules.voxelizer.voxelizeBakeAll() };
            this.domToolbarC_mem.children[3].onclick = () => { document.getElementById('openfile_import_bakes').click() };
            this.domToolbarC_mem.children[4].onclick = () => { project.exportBakes() };
            this.domToolbarC_mem.children[0].innerHTML = 'BAKE';
            this.domToolbarC_mem.children[1].innerHTML = 'UNBAKE';
            this.domToolbarC_mem.children[3].innerHTML = 'IMP';
            this.domToolbarC_mem.children[4].innerHTML = 'EXP';
        }
    }

    // find and match a toolbar button for a panel by id
    registerToolbarButtons() {
        const buttons = document.querySelectorAll("button[id^='toolbar_btn_']");
        this.panels.forEach((panel) => {
            const panelId = panel.elem.id.split('-')[1];
            for (let b = 0; b < buttons.length; b++) {
                if (buttons[b].id.split('_')[2] === panelId) {
                    buttons[b].onclick = () => { this.switchPanel(panel, buttons[b]) };
                    panel.button = buttons[b];
                }
            }
        });
    }

    registerPanels() {
        const panels = document.querySelectorAll('.panel');
        for (let i = 0; i < panels.length; i++) {
            this.addToolbarToPanels(i, panels[i]);
            this.panels.push({
                idx: i,
                elem: panels[i],
                x: 0, y: 0,
                detach: false
            });
        }
    }
    
    addToolbarToPanels(idx, elem) {
        const li = document.createElement('li');
        li.classList.add('row_panel');

        const div_move = document.createElement('div');
        const div_hide = document.createElement('div');
        const div_reset = document.createElement('div');
        div_move.innerHTML = '<i class="material-icons">open_with</i>';
        div_hide.innerHTML = '<i class="material-icons">remove_red_eye</i>';
        div_reset.innerHTML = '<i class="material-icons">exit_to_app</i>';
        div_move.title = 'Move';
        div_hide.title = 'Hide';
        div_reset.title = 'Reset';

        div_move.onpointerdown = (ev) => {
            elem.style.borderRadius = '6px';
            elem.style.borderTop = 'solid 1px steelblue';
            this.panels[idx].detach = true;
            this.dragElement(idx, ev.target, elem);
        };

        div_hide.onclick = () => {
            this.panels[idx].elem.style.display = 'none';
            this.panels[idx].button.style.textDecoration = 'none';
        };

        div_reset.onclick = () => {
            this.resetPanel(idx);
        };
        
        li.appendChild(div_move);
        li.appendChild(div_hide);
        li.appendChild(div_reset);
        
        elem.classList.add('panel');
        elem.insertBefore(li, elem.firstChild);
        elem.onpointerdown = () => {
            this.panelToFront(this.panels[idx]);
        };
    }

    clearAllPanels(exclude) {
        this.panels.forEach(panel => {
            if (!panel.detach && panel.elem !== exclude) {
                panel.elem.style.display = 'none';
                if (panel.button)
                    panel.button.style.textDecoration = 'none';
            }
        });
    }

    switchPanel(panel) {
        this.clearAllPanels(panel.elem);
        if (panel.elem.style.display === 'unset') {
            panel.elem.style.display = 'none';
            panel.button.style.textDecoration = 'none';
        } else {
            panel.elem.style.display = 'unset';
            panel.button.style.textDecoration = 'underline';
            if (!panel.detach)
                this.panelToFront(panel);
        }
    }

    panelToFront(panel) {
        panel.elem.style.zIndex = this.lastIndex + 1;

        this.lastIndex += 1;
        if (this.lastIndex > 2000)
            this.lastIndex = 1000;
    }

    resetPanel(idx) {
        this.panels[idx].x = 0;
        this.panels[idx].y = 0;
        this.panels[idx].detach = false;
        this.panels[idx].elem.style.transform = 'none';
        this.panels[idx].elem.style.borderTop = 'none';
        this.panels[idx].elem.style.borderRadius = '3px';
        this.panels[idx].elem.style.borderTopLeftRadius = '0';
        this.panels[idx].elem.style.borderTopRightRadius = '0';
        this.panels[idx].elem.style.display = 'none';
        this.panels[idx].elem.style.zIndex = 1000;
        this.panels[idx].button.style.textDecoration = 'none';
    }

    toggleHover(isEnabled) {
        if (isEnabled) {
            for (let i = 1; i < this.domHover.children.length; i++)
                this.domHover.children[i].style.display = 'unset';
        } else {
            for (let i = 1; i < this.domHover.children.length; i++)
                this.domHover.children[i].style.display = 'none';
        }
    }

    updateStatus() {
        this.domInfo[0].innerHTML = engine.getFps();
        this.domInfo[1].innerHTML = builder.voxels.length + ' VOX';
        this.domInfo[2].innerHTML = palette.uniqueColors.length + ' COL';
        this.domInfo[3].innerHTML = pool.meshes.length + ' MSH';
    }

    notification(str, timeout = 2500) {
        if (this.notificationTimer)
            clearTimeout(this.notificationTimer);
        this.domNotifier.innerHTML = str.toUpperCase();
        this.domNotifier.style.color = getStyleRoot('--btn-color');
        this.domNotifier.style.display = 'unset';
        this.notificationTimer = setTimeout(() => {
            this.domNotifier.style.display = 'none';
        }, timeout);
    }

    errorMessage(str, timeout = 2500) {
        if (this.notificationTimer)
            clearTimeout(this.notificationTimer);
        this.domNotifier.innerHTML = str.toUpperCase();
        this.domNotifier.style.color = 'indianred';
        this.domNotifier.style.display = 'unset';
        this.notificationTimer = setTimeout(() => {
            this.domNotifier.style.display = 'none';
        }, timeout);
    }

    activateEyedropper() {
        if (this.eyeDropper) {
            this.eyeDropper.open({ signal: this.abortController.signal }).then(res => {
                currentColor = res.sRGBHex.toUpperCase();
                // fix for linux systems (sRGBHex return RGBA)
                if (currentColor.startsWith('RGBA')) {
                    const rgb = currentColor.match(/\d+/g);
                    currentColor = rgbIntToHexGamma(rgb[0], rgb[1], rgb[2], 1);
                }
                uix.colorPicker.value = color3FromHex(currentColor);
            }).catch(err => {
                this.abortController.abort();
                this.abortController = new AbortController();
            });
        }
    }

    async showConfirm(title) {
        this.domConfirmBlocker.style.display = 'unset';
        this.domConfirm.style.display = 'unset';
        this.domConfirm.children[0].innerHTML = title;
        return new Promise((resolve) => {
            this.domConfirm.children[1].onclick = () => {
                this.domConfirmBlocker.style.display = 'none';
                this.domConfirm.style.display = 'none';
                resolve(false);
            };
            this.domConfirm.children[2].onclick = () => {
                this.domConfirmBlocker.style.display = 'none';
                this.domConfirm.style.display = 'none';
                resolve(true);
            };
            this.domConfirmBlocker.onclick = () => {
                this.domConfirmBlocker.style.display = 'none';
                this.domConfirm.style.display = 'none';
                resolve(false);
            };
        });
    }

    hideInterface(isEnabled) {
        if (isEnabled) {
            this.domMenus.style.display = 'none';
            this.domHover.style.display = 'none';
            this.domPalette.style.display = 'none';
            this.domMeshList.style.display = 'none';
            this.domMenuInScreenLeft.style.display = 'none';
            this.domMenuInScreenRight.style.display = 'none';
            this.domMenuInScreenBottom.style.display = 'none';
            this.domInfoParent.style.display = 'none';
            this.domInfoTool.style.display = 'none';
        } else {
            this.domMenus.style.display = 'unset';
            if (MODE == 0) {
                this.domHover.style.display = 'unset';
                this.domPalette.style.display = 'unset';
                this.domMenuInScreenLeft.style.display = 'flex';
                this.domMenuInScreenRight.style.display = 'flex';
                this.domMenuInScreenBottom.style.display = 'flex';
                this.domInfoTool.style.display = 'unset';
                palette.create();
            }
            if (MODE == 2) {
                this.domMeshList.style.display = 'unset';
            }
            this.domInfoParent.style.display = 'unset';
        }
    }

    toggleDebugLayer() {
        if (scene.debugLayer.isVisible()) {
            scene.debugLayer.hide();
        } else {
            scene.debugLayer.show({
                embedMode: false,
                additionalNodes: [
                    {
                        name: "Baked Meshes",
                        getContent: () => pool.meshes
                    }
                ]
            }).then(() => {
                document.getElementById('sceneExplorer').style.position = 'fixed';
                document.getElementById('sceneExplorer').style.zIndex = '2000';
                document.getElementById('inspector-host').style.zIndex = '2000';
            });
        }
    }

    dragElement(hIndex, elem, target) {
        let active = false;
        let currentX, currentY, initialX, initialY;

        // prevent fast-dragging problem with background elements
        document.body.addEventListener("mousedown", dragStart, false);
        document.body.addEventListener("mouseup", dragEnd, false);
        document.body.addEventListener("mousemove", drag, false);
        document.body.addEventListener("touchstart", dragStart, false);
        document.body.addEventListener("touchend", dragEnd, false);
        document.body.addEventListener("touchmove", drag, false);

        function dragStart(e) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - ui.panels[hIndex].x;
                initialY = e.touches[0].clientY - ui.panels[hIndex].y;
            } else {
                initialX = e.clientX - ui.panels[hIndex].x;
                initialY = e.clientY - ui.panels[hIndex].y;
            }
            if (e.target === elem) active = true;
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            active = false;
            document.body.removeEventListener("mousedown", dragStart, false);
            document.body.removeEventListener("mouseup", dragEnd, false);
            document.body.removeEventListener("mousemove", drag, false);
            document.body.removeEventListener("touchstart", dragStart, false);
            document.body.removeEventListener("touchend", dragEnd, false);
            document.body.removeEventListener("touchmove", drag, false);
        }

        function drag(e) {
            if (active) {
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }
                ui.panels[hIndex].x = currentX;
                ui.panels[hIndex].y = currentY;
                setTranslate(currentX, currentY, target);
            }
        }
        
        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate(" + xPos + "px, " + yPos + "px)";
        }
    }

    dragHover(elem, target) {
        let active = false;
        let currentX, currentY, initialX, initialY;

        document.body.addEventListener("mousedown", dragStart, false);
        document.body.addEventListener("mouseup", dragEnd, false);
        document.body.addEventListener("mousemove", drag, false);
        document.body.addEventListener("touchstart", dragStart, false);
        document.body.addEventListener("touchend", dragEnd, false);
        document.body.addEventListener("touchmove", drag, false);

        function dragStart(e) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - ui.hoverOffset.x;
                initialY = e.touches[0].clientY - ui.hoverOffset.y;
            } else {
                initialX = e.clientX - ui.hoverOffset.x;
                initialY = e.clientY - ui.hoverOffset.y;
            }
            if (e.target === elem) active = true;
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            active = false;
            document.body.removeEventListener("mousedown", dragStart, false);
            document.body.removeEventListener("mouseup", dragEnd, false);
            document.body.removeEventListener("mousemove", drag, false);
            document.body.removeEventListener("touchstart", dragStart, false);
            document.body.removeEventListener("touchend", dragEnd, false);
            document.body.removeEventListener("touchmove", drag, false);
        }

        function drag(e) {
            if (active) {
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }
                ui.hoverOffset.x = currentX;
                ui.hoverOffset.y = currentY;
                setTranslate(currentX, currentY, target);
            }
        }
        
        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate(" + xPos + "px, " + yPos + "px)";
        }
    }

    panelTranslate(elem, idx, x, y) {
        elem.style.transform = "translate(" + x + "px, " + y + "px)";
        this.panels[idx].x = 0;
        this.panels[idx].y = 0;
    }

    hoverTranslate(elem, x, y) {
        elem.style.transform = "translate(" + x + "px, " + y + "px)";
        ui.hoverOffset.x = 0;
        ui.hoverOffset.y = 0;
    }

    isOffScreen(elem, minPad = 20) {
        const rect = elem.getBoundingClientRect();
        return ((rect.x + (rect.width/2) - minPad) < 0 || (rect.x + minPad) > window.innerWidth ||
                (rect.y + minPad) < 0 || (rect.y + minPad) > window.innerHeight);
    }

    offscreenCheckPanel() {
        this.panels.forEach((panel) => {
            if (this.isOffScreen(panel.elem, 60))
                this.panelTranslate(panel.elem, panel.idx, 0, 0);
        });
    }

    offscreenCheckHover() {
        if (this.isOffScreen(this.domHover))
            this.hoverTranslate(this.domHover, 0, 0);
    }

    toggleElem(elem) {
        (elem.style.display === 'unset') ?
            elem.style.display = 'none' :
            elem.style.display = 'unset';
    }

    checkMode(mode) {
        if (MODE !== mode) {
            if (mode == 0) {
                ui.notification('select model tab');
            } else if (mode == 1) {
                ui.notification('select render tab');
            } else if (mode == 2) {
                ui.notification('select export tab');
            }
            return false;
        }
        return true;
    }
}


// -------------------------------------------------------
// UserInterfaceAdvanced


class UserInterfaceAdvanced {
    constructor() {
        this.advancedTexture = undefined;
        this.utilLayer = undefined;
        this.colorPicker = undefined;
        this.gizmo = undefined;
        this.gizmoVoxel = undefined;
        this.sunNode = undefined;
        this.sunGizmoUp = undefined;
        this.sunGizmoNews = undefined;
        this.isSunLocatorActive = undefined;

        this.init();
    }

    init() {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", {}, scene);
        this.utilLayer = new BABYLON.UtilityLayerRenderer(scene);
        this.utilLayer.utilityLayerScene.autoClearDepthAndStencil = true;

        this.createAdvancedColorPicker();
        this.initLightLocator();
    }

    createAdvancedColorPicker() {
        const panel = new BABYLON.GUI.StackPanel();
        panel.width = "125px";
        panel.height = "125px";
        panel.isVertical = true;
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.advancedTexture.addControl(panel);  

        this.colorPicker = new BABYLON.GUI.ColorPicker();
        this.colorPicker.value = color3FromHex(currentColor);
        this.colorPicker.height = "116px";
        this.colorPicker.width = "116px";
        this.colorPicker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.colorPicker.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
        this.colorPicker.onValueChangedObservable.add((color3) => {
            currentColor = color3.toHexString();
            ui.domColorPicker.value = currentColor;
        });
        panel.addControl(this.colorPicker);
    }

    bindVoxelGizmo(mesh) {
        this.unbindVoxelGizmo();
        this.gizmoVoxel = new BABYLON.GizmoManager(scene, 5, new BABYLON.UtilityLayerRenderer(scene));
        this.gizmoVoxel.positionGizmoEnabled = true;
        this.gizmoVoxel.rotationGizmoEnabled = false;
        this.gizmoVoxel.scaleGizmoEnabled = false;
        this.gizmoVoxel.usePointerToAttachGizmos = false;
        this.gizmoVoxel.clearGizmoOnEmptyPointerEvent = true;

        this.gizmoVoxel.gizmos.positionGizmo.scaleRatio = 0.6;
        this.gizmoVoxel.gizmos.positionGizmo.snapDistance = 1;
        this.gizmoVoxel.gizmos.positionGizmo.planarGizmoEnabled = false;
        this.gizmoVoxel.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = true;
        [ this.gizmoVoxel.gizmos.positionGizmo.xGizmo,
          this.gizmoVoxel.gizmos.positionGizmo.yGizmo,
          this.gizmoVoxel.gizmos.positionGizmo.zGizmo ].forEach((gizmo) => {
                gizmo.dragBehavior.onDragObservable.add(() => {
                    light.updateShadowMap();
                });
            });

        this.gizmoVoxel.attachableMeshes = [ mesh ];
        this.gizmoVoxel.attachToMesh(mesh);
    }

    unbindVoxelGizmo() {
        if (this.gizmoVoxel)
            this.gizmoVoxel.dispose();
        this.gizmoVoxel = undefined;
    }

    bindTransformGizmo(meshes) {
        this.unbindTransformGizmo();
        if (meshes.length == 0) return;

        this.gizmo = new BABYLON.GizmoManager(scene, 5, new BABYLON.UtilityLayerRenderer(scene));
        this.gizmo.positionGizmoEnabled = true;
        this.gizmo.rotationGizmoEnabled = true;
        this.gizmo.scaleGizmoEnabled = false;
        this.gizmo.usePointerToAttachGizmos = true;
        this.gizmo.clearGizmoOnEmptyPointerEvent = true;

        this.gizmo.gizmos.positionGizmo.scaleRatio = 0.6;
        this.gizmo.gizmos.positionGizmo.snapDistance = 1;
        this.gizmo.gizmos.positionGizmo.xPlaneGizmo.snapDistance = 1;
        this.gizmo.gizmos.positionGizmo.yPlaneGizmo.snapDistance = 1;
        this.gizmo.gizmos.positionGizmo.zPlaneGizmo.snapDistance = 1;
        this.gizmo.gizmos.positionGizmo.planarGizmoEnabled = false;
        this.gizmo.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = true;
        [ this.gizmo.gizmos.positionGizmo.xGizmo,
          this.gizmo.gizmos.positionGizmo.yGizmo,
          this.gizmo.gizmos.positionGizmo.zGizmo,
          this.gizmo.gizmos.positionGizmo.xPlaneGizmo,
          this.gizmo.gizmos.positionGizmo.yPlaneGizmo,
          this.gizmo.gizmos.positionGizmo.zPlaneGizmo ].forEach((gizmo) => {
                gizmo.dragBehavior.onDragObservable.add(() => {
                    light.updateShadowMap();
                });
            });
        
        this.gizmo.gizmos.rotationGizmo.scaleRatio = 0.3;
        this.gizmo.gizmos.rotationGizmo.snapDistance = Math.PI / 8;
        this.gizmo.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = false;
        [ this.gizmo.gizmos.rotationGizmo.xGizmo,
          this.gizmo.gizmos.rotationGizmo.yGizmo,
          this.gizmo.gizmos.rotationGizmo.zGizmo ].forEach((gizmo) => {
                gizmo.dragBehavior.onDragObservable.add(() => {
                    light.updateShadowMap();
                });
            });

        (meshes.length > 1) ?
            this.gizmo.attachableMeshes = meshes :
            this.gizmo.attachableMeshes = [meshes];

        this.gizmo.onAttachedToMeshObservable.add((mesh) => {
            (mesh) ? pool.onGizmoAttached(mesh) : pool.deselectMesh();
        });
    }

    unbindTransformGizmo() {
        if (this.gizmo)
            this.gizmo.dispose();
        this.gizmo = undefined;
    }

    initLightLocator() {
        this.sunNode = new BABYLON.TransformNode();
        this.sunNode.position.x -= 0.5;
        this.sunNode.position.y -= 0.5;
        this.sunNode.position.z -= 0.5;
        this.sunNode.rotation.x = PIH;
        this.sunNode.rotation.y = light.angle * Math.PI / 180;
        this.sunNode.isVisible = false;
        this.sunNode.doNotSerialize = true;

        this.sunGizmoUp = new BABYLON.AxisScaleGizmo(AXIS_Y, COL_AQUA_RGB, this.utilLayer, undefined, 2);
        this.sunGizmoUp.scaleRatio = 0.8;
        this.sunGizmoUp.sensitivity = 5.0;
        this.sunGizmoUp.attachedMesh = null;
        this.sunGizmoUp.uniformScaling = true;
        this.sunGizmoUp.updateGizmoRotationToMatchAttachedMesh = false;
        this.sunGizmoUp.dragBehavior.onDragObservable.add(() => {
            light.updateHeight(light.location.y / this.sunNode.scaling.x);
            modules.sandbox.updateLight();
        });

        this.sunGizmoNews = new BABYLON.PlaneRotationGizmo(AXIS_Y, COL_AQUA_RGB, this.utilLayer);
        this.sunGizmoNews.scaleRatio = 0.8;
        this.sunGizmoNews.attachedMesh = null;
        this.sunGizmoNews.updateGizmoRotationToMatchAttachedMesh = false;
        this.sunGizmoNews.dragBehavior.onDragObservable.add(() => {
            light.updateAngle(this.sunNode.rotation.y * 180 / Math.PI);
            modules.sandbox.updateLight();
        });
    }

    showLightLocator() {        
        this.sunGizmoUp.attachedMesh = this.sunNode;
        this.sunGizmoNews.attachedMesh = this.sunNode;
        ui.domInScreenLightLocator.firstChild.style.color = COL_ORANGE;
        this.isSunLocatorActive = true;
    }

    hideLightLocator() {
        this.sunGizmoUp.attachedMesh = null;
        this.sunGizmoNews.attachedMesh = null;
        ui.domInScreenLightLocator.firstChild.style.color = COL_AQUA;
        this.isSunLocatorActive = false;
    }

    setLightLocator(isEnabled) {
        (isEnabled) ? this.showLightLocator() : this.hideLightLocator();
    }

    toggleLightLocator() {
        if (this.sunGizmoUp.attachedMesh) {
            this.hideLightLocator();
            this.isSunLocatorActive = false;
        } else {
            this.showLightLocator();
            this.isSunLocatorActive = true;
        }
    }
}


// -------------------------------------------------------
// Initialize


export const preferences = new Preferences();
export const camera = new Camera();
export const scene = new MainScene().create();
const axisView = new AxisViewScene();
const renderTarget = new RenderTarget();
export const hdri = new HDRI();
export const light = new Light();
const material = new Material();
export const builder = new Builder();
export const xformer = new Transformers();
const symmetry = new Symmetry();
const ghosts = new Ghosts();
export const ui = new UserInterface();
const uix = new UserInterfaceAdvanced();
export const pool = new MeshPool();
const helper = new Helper();
const tool = new Tool();
const toolMesh = new ToolMesh();
const palette = new Palette();
const snapshot = new Snapshot();
const memory = new Memory();
export const project = new Project();


// -------------------------------------------------------
// Events


engine.engine.runRenderLoop(() => {
    if (engine.isRendering)
        scene.render();
});

scene.executeOnceBeforeRender(() => {
    preferences.init();
});

scene.executeWhenReady(() => {
    preferences.finish();
});

scene.registerAfterRender(() => {
    if (engine.isRendering) {
        if (isRenderAxisView) {
            axisView.scene.render();
            axisView.scene.activeCamera.alpha = scene.activeCamera.alpha;
            axisView.scene.activeCamera.beta = scene.activeCamera.beta;
        }
        
        if (!tool.isMouseDown) {
            camera.lastPos = [ camera.camera0.alpha, camera.camera0.beta ];

            if (duplicateFlag == 1 && !builder.isWorking) {
                duplicateFlag = 0;
                builder.removeDuplicates();
            }
        }
        
        if (scene.activeCamera.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA)
            camera.setOrthoMode();

        ui.updateStatus();
    }
});

scene.onPointerObservable.add((pInfo) => {
    switch (pInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
            if (!axisView.registerEvent()) {
                if (MODE == 0) tool.handleToolDown(pInfo.pickInfo);
                if (MODE == 2) toolMesh.handleToolDown();
            }
            break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
            if (MODE == 0) tool.handleToolMove(pInfo.pickInfo);
            break;
        case BABYLON.PointerEventTypes.POINTERUP:
            if (MODE == 0) tool.handleToolUp();
            break;
        case BABYLON.PointerEventTypes.POINTERWHEEL:
            if (!builder.isWorking)
                scene.activeCamera.attachControl(canvas, true);
            break;
    }
});

document.addEventListener("keydown", (ev) => {
    if (ev.target.matches(".ignorekeys")) return;
    if (ev.key == '/') ui.toggleDebugLayer();
    if (scene.debugLayer.isVisible()) return;

    if (MODE == 0 && !tool.last && !tool.isMouseDown) {
        if (ev.altKey || ev.key == ' ') {
            tool.last = tool.name;
            tool.toolSelector('camera');
            return;
        }
    }
    
    switch (ev.key.toLowerCase()) {
        case 'enter':
            if (ev.target instanceof HTMLButtonElement) return;
            xformer.apply();
            break;
        case '`':
            tool.toolSelector('camera', true);
            break;
        case '1':
            tool.toolSelector('add', true);
            break;
        case '2':
            tool.toolSelector('remove', true);
            break;
        case '3':
            tool.toolSelector('box_add', true);
            break;
        case '4':
            tool.toolSelector('box_remove', true);
            break;
        case '5':
            tool.toolSelector('paint', true);
            break;
        case '6':
            tool.toolSelector('box_paint', true);
            break;
        case '7':
            tool.toolSelector('bucket', true);
            break;
        case '8':
            tool.toolSelector('eyedrop', true);
            break;
        case 't':
            tool.toolSelector('transform_box', true);
            break;
        case 's':
            symmetry.switchAxis();
            break;
        case 'c':
            if (MODE == 0) {
                tool.toolSelector('camera', true);
            } else if (MODE == 2) {
                pool.cloneSelected();
            }
            break;
        case 'delete':
            if (MODE == 0) {
                xformer.deleteSelected();
            } else if (MODE == 2) {
                pool.deleteSelected();
            }
            break;
        case 'f':
            camera.frame();
            break;
        case 'o':
            camera.switchOrtho();
            break;
        case 'r':
            (modules.sandbox.isActive()) ? ui.setMode(0) : ui.setMode(1);
            break;
    }

    if (ev.ctrlKey && ev.key.toLowerCase() === 'l')
        document.getElementById('openfile_json').click();
    
    if (MODE == 0) {
        if (ev.ctrlKey && ev.key.toLowerCase() === 'z') {
            ev.preventDefault();
            xformer.apply();
            memory.undo();
        }
        if (ev.ctrlKey && ev.key.toLowerCase() === 'x') {
            ev.preventDefault();
            xformer.apply();
            memory.redo();
        }
    }
}, false);

document.addEventListener("keyup", () => {
    if (tool.last) {
        tool.toolSelector(tool.last);
        tool.last = null;
    }
}, false);

window.addEventListener("resize", () => {
    scene.getEngine().resize(true);
    renderTarget.resize();
    
    if (MODE == 0) palette.create();
    if (MODE == 2) pool.createMeshList();
    
    material.updateCelMaterial();
    axisView.updateViewport();

    ui.offscreenCheckPanel();
    ui.offscreenCheckHover();

    if (modules.sandbox.isActive())
        modules.sandbox.resize();
}, false);


// -------------------------------------------------------
// Events File


canvas.ondrop = (ev) => { dropHandler(ev) };
canvas.ondragover = (ev) => { dragHandler(ev) };
canvas.ondragleave = (ev) => { dragLeaveHandler(ev) };

document.getElementById('openfile_json').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandler(ev.target.files[0]);
}, false);

document.getElementById('openfile_import_voxels').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandlerNoDrop(ev.target.files[0], 'import_voxels');
}, false);

document.getElementById('openfile_import_bakes').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandlerNoDrop(ev.target.files[0], 'import_bakes');
}, false);

document.getElementById('openfile_vox').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandler(ev.target.files[0]);
}, false);

document.getElementById('openfile_voxelizer').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandler(ev.target.files[0]);
}, false);

document.getElementById('openfile_voxelizer_img').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandler(ev.target.files[0]);
}, false);

document.getElementById('openfile_hdr').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandler(ev.target.files[0]);
}, false);

function fileHandler(file) {
    const ext = file.name.split('.').pop().toLowerCase(); //ext|exts
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = () => {
        if (ext == 'json') project.load(reader.result);
        if (ext == 'obj') if (MODE == 0) modules.voxelizer.importMeshOBJ(url);
        if (ext == 'glb') if (MODE == 0) modules.voxelizer.importMeshGLB(url);
        if (ext == 'vox') project.loadMagicaVoxel(reader.result);
        if (ext == 'hdr') hdri.loadHDR(url);
        if (MODE == 0) {
            if (['jpg','png','svg'].includes(ext))
                modules.voxelizer.voxelize2D(reader.result);
        }
        URL.revokeObjectURL(url);
    }
    if (ext == 'json') {
        reader.readAsText(file);
    } else if (ext == 'vox') {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsDataURL(file);
    }
}

function fileHandlerNoDrop(file, type) {
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = () => {
        if (type == 'import_voxels') project.importVoxels(reader.result);
        if (type == 'import_bakes')  project.importBakes(reader.result);
        URL.revokeObjectURL(url);
    }
    if (type == 'import_voxels' || type == 'import_bakes')
        reader.readAsText(file);
}

function dropHandler(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.files[0] && ev.dataTransfer.files[0].path !== "")
        fileHandler(ev.dataTransfer.files[0]);
}

function dragHandler(ev) {
    ev.preventDefault();
}

function dragLeaveHandler(ev) {
    ev.preventDefault();
}


// -------------------------------------------------------
// Events DOM


ui.domMenus.onpointerdown = (ev) => {
    if (MODE == 0) { // prevent premature usage!
        if (ev.target !== canvas && ev.target !== ui.domHover) {
            xformer.apply();
            helper.clearOverlays();
        }
    }
};

ui.domHover.onpointerdown = () => {
    xformer.apply();
    helper.clearOverlays();
};

ui.domHover.children[0].onpointerdown = (ev) => {
    ui.dragHover(ev.target, ev.target.parentElement);
};
ui.domHover.children[0].onclick = () => { tool.toolSelector('camera') };
ui.domHover.children[1].onclick = () => { tool.toolSelector('box_paint') };
ui.domHover.children[2].onclick = () => { tool.toolSelector('box_add') };
ui.domHover.children[3].onclick = () => { tool.toolSelector('box_remove') };
ui.domHover.children[4].onclick = () => { tool.toolSelector('bucket') };
ui.domHover.children[5].onclick = () => { tool.toolSelector('remove') };
ui.domHover.children[6].onclick = () => { tool.toolSelector('paint') };
ui.domHover.children[7].onclick = () => { tool.toolSelector('add') };
ui.domHover.children[8].onclick = () => { tool.toolSelector('eyedrop') };

ui.domInScreenSymmAxis.onclick = () => {
    symmetry.switchAxis();
};

ui.domInScreenGridPlane.onclick = () => {
    helper.toggleWorkplane(0);
};

ui.domInScreenWorkplane.onclick = () => {
    helper.toggleWorkplane(1);
};

ui.domInScreenLightLocator.onclick = () => {
    uix.toggleLightLocator();
};

ui.domInScreenOrtho.onclick = () => {
    camera.switchOrtho();
};

ui.domSandboxRender.children[0].onclick = () => {
    if (!ui.domRenderAutoStart.checked)
        modules.sandbox.toggleRender();
};


ui.domColorPicker.oninput = (ev) => {
    currentColor = ev.target.value.toUpperCase();
    uix.colorPicker.value = color3FromHex(currentColor);
};

ui.domColorPickerAlbedo.oninput = (ev) => {
    currentColorBake = ev.target.value.toUpperCase();
    pool.setMaterial('albedo'); // update material
};

ui.domColorPickerEmissive.oninput = () => {
    pool.setMaterial('emissive');
};

ui.domColorPickerVertexColor.oninput = (ev) => {
    (pool.meshes.length > 0) ?
        pool.updateVertexColors(ev.target.value) :
        ui.notification('select a mesh');
};

ui.domColorPickerBackground.oninput = (ev) => {
    scene.clearColor = color4FromHex(ev.target.value);
    scene.autoClear = ui.domBackgroundCheck.checked;
};

ui.domColorPickerLightColor.oninput = (ev) => {
    light.updateColor(ev.target.value);
    modules.sandbox.updateLight();
};

ui.domPixelEyedropper.onclick = () => {
    ui.activateEyedropper();
};


ui.domRenderAutoStart.oninput = (ev) => {
    if (modules.sandbox.isActive())
        modules.sandbox.setAutoStart(ev.target.checked);
};

ui.domRenderMaxSamples.onchange = (ev) => {
    if (ev.target.value < 8) ev.target.value = 8;
    if (modules.sandbox.isActive())
        modules.sandbox.pathTracer.updateMaxSamples(ev.target.value);
};

ui.domRenderBounces.onchange = (ev) => {
    if (modules.sandbox.isActive())
        modules.sandbox.pathTracer.updateBounces(ev.target.value);
};

ui.domRenderDPR.onchange = (ev) => {
    if (modules.sandbox.isActive())
        modules.sandbox.pathTracer.updateRenderScale(ev.target.value);
};

ui.domRenderTiles.onchange = (ev) => {
    if (modules.sandbox.isActive())
        modules.sandbox.pathTracer.updateTiles(parseInt(ev.target.value));
};


ui.domRenderEnvPower.onchange = (ev) => {
    if (ev.target.value < 1) ev.target.value = 1;
    if (modules.sandbox.isActive())
        modules.sandbox.updateEnvIntensity(ev.target.value);
};

ui.domRenderEnvPower.onwheel = (ev) => {
    if (modules.sandbox.isActive())
        modules.sandbox.updateEnvIntensity(ev.target.value);
};


ui.domRenderPause.onclick = () => {
    if (modules.sandbox.isActiveRender())
        modules.sandbox.togglePause();
};

ui.domRenderShot.onclick = () => {
    if (modules.sandbox.isActive())
        modules.sandbox.shot();
};

ui.domRenderFast.oninput = () => {
    if (modules.sandbox.isActive())
        modules.sandbox.toggleFastMode();
};

ui.domRenderShade.oninput = () => {
    if (modules.sandbox.isActive())
        modules.sandbox.toggleShadeMode();
};

ui.domRenderMaterialRoughness.onchange = (ev) => {
    if (modules.sandbox.isActive()) {
        modules.sandbox.meshes[0].material.roughness = ev.target.value;
        modules.sandbox.pathTracer.updateMaterials();
    }
};

ui.domRenderMaterialMetalness.onchange = (ev) => {
    if (modules.sandbox.isActive()) {
        modules.sandbox.meshes[0].material.metalness = ev.target.value;
        modules.sandbox.pathTracer.updateMaterials();
    }
};

ui.domRenderMaterialTransmission.onchange = (ev) => {
    if (modules.sandbox.isActive()) {
        modules.sandbox.meshes[0].material.transmission = ev.target.value;
        modules.sandbox.pathTracer.updateMaterials();
    }
};

ui.domRenderGrid.oninput = (ev) => {
    if (modules.sandbox.isActive())
        modules.sandbox.setGrid(ev.target.checked);
};


ui.domOrthoBtn.onclick = () => {
    camera.switchOrtho();
};

ui.domCameraFov.oninput = (ev) => {
    if (ev.target.value > 0)
        camera.setFov(ev.target.value);
};

ui.domCameraFov.onchange = (ev) => {
    if (ev.target.value > 0) {
        if (modules.sandbox.isActive())
            modules.sandbox.updateCamera(false);
    }
};

ui.domCameraFStop.onchange = (ev) => {
    if (modules.sandbox.isActive() && ev.target.value > 0) {
        modules.sandbox.camera.fStop = ev.target.value;
        modules.sandbox.pathTracer.updateCamera();
    }
};

ui.domCameraFocalLength.onchange = (ev) => {
    if (modules.sandbox.isActive() && ev.target.value > 0) {
        modules.sandbox.camera.focusDistance = ev.target.value;
        modules.sandbox.pathTracer.updateCamera();
    }
};

ui.domAutoRotation.onclick = () => {
    camera.toggleCameraAutoRotation();
};

ui.domAutoRotationCCW.onclick = () => {
    camera.updateCameraAutoRotation();
};


ui.domSymmAxisS.onclick = () => {
    symmetry.switchAxisByNum(-1);
};

ui.domSymmAxisX.onclick = () => {
    symmetry.switchAxisByNum(0);
};

ui.domSymmAxisY.onclick = () => {
    symmetry.switchAxisByNum(1);
};

ui.domSymmAxisZ.onclick = () => {
    symmetry.switchAxisByNum(2);
};

ui.domSymmCenter.onclick = () => {
    helper.setSymmPivot();
};


ui.domBackgroundCheck.onclick = (ev) => {
    scene.autoClear = ev.target.checked;
    if (scene.autoClear)
        scene.clearColor = color4FromHex(ui.domColorPickerBackground.value);
};

ui.domHdriBackground.onclick = (ev) => {
    hdri.showSkybox(ev.target.checked);
    if (modules.sandbox.isActive())
        modules.sandbox.updateBackground(ev.target.checked);
};

ui.domHdriBlur.oninput = (ev) => {
    hdri.setBlurAmount(ev.target.value);
    if (modules.sandbox.isActive())
        modules.sandbox.updateBackground(ui.domHdriBackground.checked);
};


ui.domLightIntensity.oninput = (ev) => {
    light.updateIntensity(ev.target.value);
    modules.sandbox.light.intensity = ev.target.value;
    if (modules.sandbox.isActive())
        modules.sandbox.pathTracer.updateLights();
};

ui.domLightShadows.onclick = (ev) => {
    light.enableShadows(ev.target.checked);
    modules.sandbox.light.castShadow = ev.target.checked;
    if (modules.sandbox.isActive())
        modules.sandbox.pathTracer.updateLights();
};


ui.domRoughness.oninput = () => {
    pool.setMaterial('roughness');
};

ui.domMetallic.oninput = () => {
    pool.setMaterial('metallic');
};

ui.domAlpha.oninput = () => {
    pool.setMaterial('alpha');
};

ui.domMaterialSwitch.onclick = () => {
    material.switchMaterial();
};


document.getElementById('bake_tex_solid').onclick = () => {
    material.setPBRTexture(0);
    pool.replaceTexture();
};

document.getElementById('bake_tex_outline').onclick = () => {
    material.setPBRTexture(1);
    pool.replaceTexture();
};

document.getElementById('bake_tex_grid').onclick = () => {
    material.setPBRTexture(2);
    pool.replaceTexture();
};

document.getElementById('bake_tex_checker').onclick = () => {
    material.setPBRTexture(3);
    pool.replaceTexture();
};


document.getElementById('fullscreen').onclick = () =>               { toggleFullscreen() };
document.getElementById('tab-model').onclick = () =>                { ui.setMode(0) };
document.getElementById('tab-render').onclick = () =>               { ui.setMode(1) };
document.getElementById('tab-export').onclick = () =>               { ui.setMode(2) };
document.getElementById('about_shortcuts').onclick = () =>          { ui.toggleElem(document.getElementById('shortcuts')) };
document.getElementById('about_examples').onchange = (ev) =>        { project.loadFromUrl(ev.target.options[ev.target.selectedIndex].value) };
document.getElementById('about_examples_vox').onchange = (ev) =>    { project.loadFromUrl(ev.target.options[ev.target.selectedIndex].value) };
document.getElementById('reset_hover').onclick = () =>              { ui.hoverTranslate(ui.domHover, 0, 0) };
document.getElementById('clear_cache').onclick = (ev) =>            { engine.clearCache(scene, ev.target) };
document.getElementById('ws_connect').onclick = () =>               { if (ui.checkMode(0)) modules.ws_client.connect() };
document.getElementById('new_project').onclick = () =>              { project.newProject() };
document.getElementById('save_project').onclick = () =>             { project.save() };
document.getElementById('export_voxels').onclick = () =>            { project.exportVoxels() };
document.getElementById('export_bakes').onclick = () =>             { project.exportBakes() };
document.getElementById('screenshot').onclick = () =>               { project.createScreenshot() };
document.getElementById('create_box').onclick = () =>               { if (ui.checkMode(0)) modules.generator.createBox() };
document.getElementById('create_plane').onclick = () =>             { if (ui.checkMode(0)) modules.generator.createBox(true) };
document.getElementById('create_isometric').onclick = () =>         { if (ui.checkMode(0)) modules.generator.createIsometric() };
document.getElementById('create_sphere').onclick = () =>            { if (ui.checkMode(0)) modules.generator.createSphere() };
document.getElementById('create_terrain').onclick = () =>           { if (ui.checkMode(0)) modules.generator.createTerrain() };
document.getElementById('import_mesh_url').onclick = (ev) =>        { if (ui.checkMode(0)) modules.voxelizer.loadFromUrl(ev.target.previousElementSibling.value) };
document.getElementById('import_image_paste').onclick = () =>       { if (ui.checkMode(0)) modules.voxelizer.pasteBase64Image() };
document.getElementById('import_image_url').onclick = (ev) =>       { if (ui.checkMode(0)) modules.voxelizer.loadFromUrlImage(ev.target.previousElementSibling.value) };
document.getElementById('symm_p2n').onclick = () =>                 { if (ui.checkMode(0)) symmetry.symmetrizeVoxels(1) };
document.getElementById('symm_n2p').onclick = () =>                 { if (ui.checkMode(0)) symmetry.symmetrizeVoxels(-1) };
document.getElementById('symm_mirror').onclick = () =>              { if (ui.checkMode(0)) symmetry.mirrorVoxels() };
document.getElementById('symm_p_half').onclick = () =>              { if (ui.checkMode(0)) symmetry.deleteHalfVoxels(-1) };
document.getElementById('symm_n_half').onclick = () =>              { if (ui.checkMode(0)) symmetry.deleteHalfVoxels(1) };
document.getElementById('btn_tool_add').onclick = () =>             { if (ui.checkMode(0)) tool.toolSelector('add') };
document.getElementById('btn_tool_remove').onclick = () =>          { if (ui.checkMode(0)) tool.toolSelector('remove') };
document.getElementById('btn_tool_box_add').onclick = () =>         { if (ui.checkMode(0)) tool.toolSelector('box_add') };
document.getElementById('btn_tool_box_remove').onclick = () =>      { if (ui.checkMode(0)) tool.toolSelector('box_remove') };
document.getElementById('btn_tool_rect_add').onclick = () =>        { if (ui.checkMode(0)) tool.toolSelector('rect_add') };
document.getElementById('btn_tool_rect_remove').onclick = () =>     { if (ui.checkMode(0)) tool.toolSelector('rect_remove') };
document.getElementById('input-newbox-coord').onkeydown = (ev) =>   { if (ui.checkMode(0)) modules.generator.newBoxPosition(ev, ev.target, currentColor) };
document.getElementById('btn_tool_paint').onclick = () =>           { if (ui.checkMode(0)) tool.toolSelector('paint') };
document.getElementById('btn_tool_box_paint').onclick = () =>       { if (ui.checkMode(0)) tool.toolSelector('box_paint') };
document.getElementById('btn_tool_rect_paint').onclick = () =>      { if (ui.checkMode(0)) tool.toolSelector('rect_paint') };
document.getElementById('btn_tool_bucket').onclick = () =>          { if (ui.checkMode(0)) tool.toolSelector('bucket') };
document.getElementById('paint_all').onclick = () =>                { if (ui.checkMode(0)) builder.setAllColorsAndUpdate() };
document.getElementById('btn_tool_eyedrop').onclick = () =>         { if (ui.checkMode(0)) tool.toolSelector('eyedrop') };
document.getElementById('btn_tool_transform_box').onclick = () =>   { if (ui.checkMode(0)) tool.toolSelector('transform_box') };
document.getElementById('btn_tool_transform_rect').onclick = () =>  { if (ui.checkMode(0)) tool.toolSelector('transform_rect') };
document.getElementById('btn_tool_transform_group').onclick = () => { if (ui.checkMode(0)) tool.toolSelector('transform_group') };
document.getElementById('btn_tool_transform_visible').onclick = ()=>{ if (ui.checkMode(0)) tool.toolSelector('transform_visible') };
document.getElementById('normalize_voxels').onclick = () =>         { if (ui.checkMode(0)) builder.normalizeVoxelPositions(true) };
document.getElementById('btn_tool_measure_volume').onclick = () =>  { if (ui.checkMode(0)) tool.toolSelector('measure_volume') };
document.getElementById('btn_tool_measure_color').onclick = () =>   { if (ui.checkMode(0)) tool.toolSelector('measure_color') };
document.getElementById('reduce_voxels').onclick = () =>            { if (ui.checkMode(0)) builder.reduceVoxels() };
document.getElementById('bakery_bake').onclick = () =>              { pool.bake() };
document.getElementById('btn_tool_bakecolor').onclick = () =>       { if (ui.checkMode(0)) tool.toolSelector('bake_color') };
document.getElementById('clear_bakes').onclick = () =>              { pool.clearPool(true) };
document.getElementById('clone_bake').onclick = () =>               { if (ui.checkMode(2)) pool.cloneSelected() };
document.getElementById('merge_bakes_pick').onclick = () =>         { if (ui.checkMode(2)) toolMesh.toolSelector('merge') };
document.getElementById('merge_bakes_merge').onclick = () =>        { if (ui.checkMode(2)) toolMesh.mergeBakes() };
document.getElementById('merge_bakes_cancel').onclick = () =>       { if (ui.checkMode(2)) toolMesh.cancelSelection() };
document.getElementById('merge_all_bakes').onclick = () =>          { if (ui.checkMode(2)) pool.mergeAll() };
document.getElementById('voxelize_bake').onclick = () =>            { if (ui.checkMode(2)) modules.voxelizer.voxelizeBake() };
document.getElementById('voxelize_bake_all').onclick = () =>        { if (ui.checkMode(2)) modules.voxelizer.voxelizeBakeAll() };
document.getElementById('reset_bake_rotation').onclick = () =>      { if (ui.checkMode(2)) pool.resetRotation() };
document.getElementById('delete_bake').onclick = () =>              { if (ui.checkMode(2)) pool.deleteSelected() };
document.getElementById('camera_frame').onclick = () =>             { camera.frame() };
document.getElementById('btn_tool_frame_color').onclick = () =>     { if (ui.checkMode(0)) tool.toolSelector('frame_color') };
document.getElementById('btn_tool_frame_voxels').onclick = () =>    { if (ui.checkMode(0)) tool.toolSelector('frame_voxels') };
document.getElementById('hdr_dropdown').onclick = (ev) =>          { hdri.loadHDR(ev.target.options[ev.target.selectedIndex].value) };
document.getElementById('unload_hdr').onclick = () =>               { hdri.unloadHDR(true) };
document.getElementById('btn_tool_isolate_color').onclick = () =>   { if (ui.checkMode(0)) tool.toolSelector('isolate_color') };
document.getElementById('btn_tool_hide_color').onclick = () =>      { if (ui.checkMode(0)) tool.toolSelector('hide_color') };
document.getElementById('invert_visibility').onclick = () =>        { if (ui.checkMode(0)) builder.invertVisibilityAndUpdate() };
document.getElementById('unhide_all').onclick = () =>               { if (ui.checkMode(0)) builder.setAllVisibilityAndUpdate(true) };
document.getElementById('btn_tool_delete_color').onclick = () =>    { if (ui.checkMode(0)) tool.toolSelector('delete_color') };
document.getElementById('delete_hidden').onclick = () =>            { if (ui.checkMode(0)) builder.deleteHiddenAndUpdate() };
document.getElementById('btn_tool_bucket_inscreen').onclick = () => { if (ui.checkMode(0)) tool.toolSelector('bucket') };


// -------------------------------------------------------
// Utils


function downloadJson(data, filename) {
    const blob = new Blob([ data ], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function toggleFullscreen() {
    (document.fullscreenElement) ? document.exitFullscreen() : document.body.requestFullscreen();
}

function isMobileDevice() {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        return true;
    }
    return false;
}

function getStyleRoot(key) {
    return getComputedStyle(document.querySelector(':root')).getPropertyValue(key);
}

export function color3FromHex(hex) {
    const rgb = hexToRgbFloat(hex, 1.0);
    return Color3(rgb.r, rgb.g, rgb.b);
}

export function color4FromHex(hex) {
    const rgb = hexToRgbFloat(hex, 1.0);
    return Color4(rgb.r, rgb.g, rgb.b, 1.0);
}

export function rgbIntToHex(r, g, b) {
    return '#' + (0x1000000 + b | (g << 8) | (r << 16)).toString(16).slice(1).toUpperCase();
}

function rgbIntToHexGamma(r, g, b, gamma) {
    r = 255 * Math.pow(r / 255, gamma);
    g = 255 * Math.pow(g / 255, gamma);
    b = 255 * Math.pow(b / 255, gamma);
    return '#' + (0x1000000 + b | (g << 8) | (r << 16)).toString(16).slice(1).toUpperCase();
}

export function rgbFloatToHex(r, g, b) { // thanks to @labris
    const hr = Math.max(0, Math.min(255, Math.round(r * 255))).toString(16);
    const hg = Math.max(0, Math.min(255, Math.round(g * 255))).toString(16);
    const hb = Math.max(0, Math.min(255, Math.round(b * 255))).toString(16);
    return ("#" +
        (hr.length<2?"0":"") + hr +
        (hg.length<2?"0":"") + hg +
        (hb.length<2?"0":"") + hb).toUpperCase();
}

export function hexToRgbFloat(hex, gamma = 2.2) { // 1 / 0.4545
    return {
        r: (parseInt(hex.substring(1, 3), 16) / 255) ** gamma,
        g: (parseInt(hex.substring(3, 5), 16) / 255) ** gamma,
        b: (parseInt(hex.substring(5, 7), 16) / 255) ** gamma
    }
}

function parseBool(val) {
    return val === true || val === "true";
}
