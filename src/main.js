/*
    Aug 2019
    @nimadez

    [ Code Map ]
    01. Engine
    02. Render Target
    03. Light
    04. Main Scene
    05. Axis View Scene
    06. Camera
    07. HDRI and Skybox
    08. Material
    09. Builder
    10. Transformers
    11. Ghosts
    12. Palette
    13. Helper
    14. Tool
    15. Tool Bakery
    16. Symmetry
    17. Voxelizer
    18. Generator
    19. Bakery
    20. Snapshot
    21. Memory
    22. Project
    23. Preferences
    24. UserInterface
    25. UserInterfaceAdvanced
    26. Initialize
    27. Events
    28. Events File
    29. Events Dom
    30. Utils
*/


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
const TEX_PRESETS = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3QTVDRTc3NTg5NEUxMUVFQTQyRjk0OTNFMjM5QTAyNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3QTVDRTc3Njg5NEUxMUVFQTQyRjk0OTNFMjM5QTAyNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdBNUNFNzczODk0RTExRUVBNDJGOTQ5M0UyMzlBMDI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdBNUNFNzc0ODk0RTExRUVBNDJGOTQ5M0UyMzlBMDI1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZrHTDQAAAYBQTFRFsoBYm3FOkmZDXkMstIFamm5LkWhHk2tKY0kwi2RFc1pAsX5XfVU3jGlHf1c4bk01elo7cmpkonVRYkgvdlM4gFs+km5KsX9YrXxWfFw8eVU6fFc8Vj4pl21LeVpCf1k9elY7iWJDmnNTlWtJj2xHjmZGimZLjGVHZkcwc1E3Wz4qglw/fVg9Y0UvdVY4eFQ4pHhSd1Q5nnhPdFE4hl9BhV5Bg1xAelU7dVE3cE82hF1Aa0oypHdSelY8d1I2rHtVclVBmGpGi2lFjWVFaEgxgF8+aUoyfGA9bE86iYF6kWxOtoNcoXRPsINXoHNQeXRyj2lBf2NFlHBJo3pZsn1Ts4VatH5TtH5Vf1o9f18+roVXZEYvkG1HdVI4fFw7uYRbjWZFg2FHj2dGels7flk+hH14f1o+Xkktd15DfFxEfHx0imNEqn1VbVA8dVU4i2dDdlc5aEkyhGJIYkEpcFI8pXdRmnFHpndRp3dSVTkmdVI3dlE0YUc0j2hIj29IlG9I5IEEBgAAAQpJREFUeNpczHlDwWAcAOBfO16TyrWZ7cU2RmgaljC6jO77LulS0q1Td1+9/3s+wAMz3nt1reIlmUOB6bia++CX+07mQjrF53lKUswg1LBjIWzDZmSaXjYaxwdQEVtoIFp8z1gWbolPTaidknktmfr4zGH2iAr1wx6Sedjt2r6ATxEb572gGhrdpYiYO0wnyOtHBobrljxYduSei1LDaW4uQdOuj01mptB4yVNlJ8pZWBdLfi1wW92BUYUbQir4pLc0cbkS6vGIGEXYAKgFEy1S9ph7nijUoxwJd3EFf79sj8wmTMNpwhYI/9OgHvefJZ0PPOQUzCEEP8JNerV91X7NdoRfn+viT4ABAPBYMWcJ3TV8AAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3RTVFOUVFRTg5NEUxMUVFOEU2NEE0Qjc2Mzk1NUNDQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3RTVFOUVFRjg5NEUxMUVFOEU2NEE0Qjc2Mzk1NUNDQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdFNUU5RUVDODk0RTExRUU4RTY0QTRCNzYzOTU1Q0NBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdFNUU5RUVEODk0RTExRUU4RTY0QTRCNzYzOTU1Q0NBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Q7KkWwAAAYBQTFRFebdOibtaf75UYKA2e7RMd7NJbqxEbKQ8YqI4e7JNb7BGc7FIbatCaapAdLRKaak/b69FdrZMZaU7eblPd7dNebNKbq5EaKk+drRLaqg/ZqQ7erpQe7tRZ6c9cLBGX581b6g/dbVLa6lAa6xCcKlAcbBHaao/ZKQ6grtSZ6Y9bqQ9drBHc7NJdrVLc6pDbqZAcLFGeLhOfbZNY6Q5Z6g9capBc7JJd7hNertQcqxHbq9FaqE7eLlOdLVKdLJJZ585fLROYqE3ZaY7Xp40grVTg7RTZaY8ZqU8d7VMcbNIebRKfLxSdK9FZqA3aqtAd6ZFfa9Nbq9EcLFHcbBGbKpBZKU6b6hDcqlCdqlBdrdMfLtSerxRhLZVdq1IdLNKbp08fLVMc6tFf7hPZ6E4ebpQcK5Fc61EebBJXZ0zg7VUdbZLZqY8e65GZqc8gbhRfrBPXZ80b6dBbK1Cba5Db61Ec7JIcatCfrVNcqpEcbFHcrJIbKxCba1DaqpAa6tBaKg+a6amewAAAQtJREFUeNoEwYVCwlAUANALgoLgkhrNyI0GGwsVW+xO7O7a24tf9xx4yt306KVaLrVa0vVf2z5gD21WrGaXFOE3rlvpRbBxUdONYyxUpUwLIjt4hU14bfpFPnzVW3+mS5AvIHObf5CJkQYxwf3AhS/kezOF+o4/uA7DvnPIIzMiZYqHLGaqBGVrEG/3S4ZfaanTAqJRcglxNFGU8Z0S9vCEOhwpsLtmv4ekR8dcKIu5TGQAVowgY9RT7T41GFsQvbBH2p/jRx+aZWus4r53eeFFlPvCgRli5TAOKEYHboVCUrV8VUbpQeCYJBvAoglZG1w2qhxWlXmEYe1vqjxi6zgb5ZPdSef72b8AAwDzxT2brEwSywAAAABJRU5ErkJggg==",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBNkZDN0E5Qzg5NEUxMUVFQjBBQ0U1OTdFMzdCMkEwRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBNkZDN0E5RDg5NEUxMUVFQjBBQ0U1OTdFMzdCMkEwRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkE2RkM3QTlBODk0RTExRUVCMEFDRTU5N0UzN0IyQTBEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkE2RkM3QTlCODk0RTExRUVCMEFDRTU5N0UzN0IyQTBEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+LrswbAAAAAxQTFRFYVVdsqqqin2C////hF6/cgAAAAR0Uk5T////AEAqqfQAAAArSURBVHjaYmBkQgEMDNgEGBjAGERBBZgZGZhBmHHICTAxMoIQGGP6FiDAANEgAYipPYnfAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQzM1QzM5Mjg5NEUxMUVFQTQ0MzkwMTQ5QkI4NUY1MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQzM1QzM5Mzg5NEUxMUVFQTQ0MzkwMTQ5QkI4NUY1MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkFDMzVDMzkwODk0RTExRUVBNDQzOTAxNDlCQjg1RjUwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFDMzVDMzkxODk0RTExRUVBNDQzOTAxNDlCQjg1RjUwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+B07fYwAAAA9QTFRFMCAsSTxFsqqqYVVdin2CUV37cQAAAFBJREFUeNpsT1sSACEIMvH+Z84U2cfED8agkHl8ALsISJyxqIR8pa+pBSceofdHSEPU/vFMCkzD8PJ3LO2KBUspBYSEX7HqFaTL53SA2AIMAMYjA0rfbk99AAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCM0JCOTdDRTg5NEUxMUVFODJBQ0E1MzkxMEY4NDg4QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCM0JCOTdDRjg5NEUxMUVFODJBQ0E1MzkxMEY4NDg4QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkIzQkI5N0NDODk0RTExRUU4MkFDQTUzOTEwRjg0ODhCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkIzQkI5N0NEODk0RTExRUU4MkFDQTUzOTEwRjg0ODhCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+C4NGngAAABVQTFRFXSQkNBAcTRwgpmFFjkEwdTAsw4JVdUvSTwAAAGVJREFUeNpcj1EOAEEEQzHV+x95lR3Jbn+k9Qjmbh4Wpaohl4dnpOoWeXIFWgcLgD2yDMEw66ARcEZYAZGyImIImfwHH4Ic5i5FiXdp9yUFfQdaCdw7uFLg03whjejpeT/kHgEGAPaVA8rZyt7zAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRDNGMzIxRjg5NEUxMUVFQjg5MEFFRjY1MkZEMkVFQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRDNGMzIyMDg5NEUxMUVFQjg5MEFFRjY1MkZEMkVFQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJEM0YzMjFEODk0RTExRUVCODkwQUVGNjUyRkQyRUVBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJEM0YzMjFFODk0RTExRUVCODkwQUVGNjUyRkQyRUVBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+66c1EQAAAAlQTFRFu+3wq97mo8zWUDKPggAAADZJREFUeNpiYGRkQgKMjAxMTAyMCC6QB2PASAaYHEwrAxYzGHGZwUCRGQykuIMBnztwmAEQYADs4AG9BDDWBAAAAABJRU5ErkJggg==",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MDA5ODRDRjg5NEUxMUVFOUUyOUE0OTQxMDJCQjJENCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5MDA5ODREMDg5NEUxMUVFOUUyOUE0OTQxMDJCQjJENCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjkwMDk4NENEODk0RTExRUU5RTI5QTQ5NDEwMkJCMkQ0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjkwMDk4NENFODk0RTExRUU5RTI5QTQ5NDEwMkJCMkQ0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+BrevQwAAAA9QTFRF9+vjaZo819tx////mrpRUPR6PAAAAFtJREFUeNpsT0EOwCAMosj/3zxK42LcOFgDSBHrAlapUZxhQhQ2QTWh9hSUSwgLcbQ1BCwVkbBxWCxOam8xUPYEJhhoBv6e7FAfONYia3UUI95id/XP5y48AgwAikAC5rlAar4AAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5N0FGQjBBMjg5NEUxMUVFOENENEIwRjFFNjE3NzY0QSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5N0FGQjBBMzg5NEUxMUVFOENENEIwRjFFNjE3NzY0QSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk3QUZCMEEwODk0RTExRUU4Q0Q0QjBGMUU2MTc3NjRBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk3QUZCMEExODk0RTExRUU4Q0Q0QjBGMUU2MTc3NjRBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lZLONgAAABJQTFRFupp5gmFZz66CspJ1jnFhooJpmRnR4QAAAHdJREFUeNo0j8ERADEIAkG0/5YPNJePQ0YXwLBK7aeq5gxYAqbb39KQsJ4ZtvVOdAZ9MqsbakuFQxpX0ISHnb4PMAsIcDnRXgmRywH3PsANYluvO0eAOg5ejlrM5TjOXQHxfzn0athWuj64QH+PLOD3z0jhT4ABAJa7Av1CV1nPAAAAAElFTkSuQmCC"
];

const CSS_ROOT = document.querySelector(':root');
const COL_ORANGE = '#FFA500';
const COL_ORANGE_RGB = BABYLON.Color3.FromHexString(COL_ORANGE);
const COL_ORANGE_RGBA = BABYLON.Color4.FromHexString(COL_ORANGE + 'FF');
const COL_AQUA = '#00FFFF';
const COL_AQUA_RGB = BABYLON.Color3.FromHexString(COL_AQUA);
const COL_AQUA_RGBA = BABYLON.Color4.FromHexString(COL_AQUA + 'FF');
const COL_AXIS_X = '#EA3751';
const COL_AXIS_X_RGB = BABYLON.Color3.FromHexString(COL_AXIS_X);
const COL_AXIS_X_RGBA = BABYLON.Color4.FromHexString(COL_AXIS_X + 'FF');
const COL_AXIS_Y = '#85D10C';
const COL_AXIS_Y_RGB = BABYLON.Color3.FromHexString(COL_AXIS_Y);
const COL_AXIS_Y_RGBA = BABYLON.Color4.FromHexString(COL_AXIS_Y + 'FF');
const COL_AXIS_Z = '#2F81DF';
const COL_AXIS_Z_RGB = BABYLON.Color3.FromHexString(COL_AXIS_Z);
const COL_AXIS_Z_RGBA = BABYLON.Color4.FromHexString(COL_AXIS_Z + 'FF');
const COL_ICE = '#8398AF';
const COL_RED = '#FF0000';
const COL_BLUE = '#4682B4';
const COL_CLEAR_RGBA = new BABYLON.Color4(0, 0, 0, 0);

const PI2 = Math.PI * 2;
const PIH = Math.PI / 2;
const RAD2DEG_STATIC = 180 / Math.PI;

const MAX_VOXELS = 512000;
const MAX_VOXELS_DRAW = 64000;
const WORKPLANE_SIZE = 120;
const WORKPLANE_VISIBILITY = 0.2;
const DUPLICATE_POS = new BABYLON.Vector3(-2000000, -2000000, -2000000);
const DEF_BGCOLOR = document.getElementById('input-env-background').value.toUpperCase();
const DEF_LIGHTCOLOR = document.getElementById('input-light-color').value.toUpperCase();
const isMobile = isMobileDevice();

const canvas = document.getElementById('canvas');
const canvasPalette = document.getElementById('canvas_palette');
canvas.ondrop = (ev) => { dropHandler(ev) };
canvas.ondragover = (ev) => { dragHandler(ev) };
canvas.ondragleave = (ev) => { dragLeaveHandler(ev) };

export let MODE = 0; // model|render|export
export let FPS = 1000 / 60;
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
// Engine


class Engine {
    constructor() {
        this.webgl = undefined;
        this.webgpu = undefined;
        this.isRendering = false;

        this.init();
    }

    init() {
        this.webgl = new BABYLON.Engine(canvas, true, {});
        this.webgl.disablePerformanceMonitorInBackground = true;
        this.webgl.preserveDrawingBuffer = false;
        this.webgl.premultipliedAlpha = false;
        this.webgl.enableOfflineSupport = false;
        this.webgl.doNotHandleContextLost = true;
        this.webgl.loadingScreen = new CustomLoadingScreen();
        this.webgl.displayLoadingUI();

        this.isRendering = true;
    }

    getFps() {
        return ~~this.webgl.getFps();
    }
}


// -------------------------------------------------------
// Render Target


class RenderTarget {
    constructor() {
        this.pickTexture = undefined;
        this.reflectionProbe = undefined;

        this.init();
    }

    init() {
        this.pickTexture = new BABYLON.RenderTargetTexture('pickTexture', {
            useSRGBBuffer: false, width: engine.webgl.getRenderWidth(), height: engine.webgl.getRenderHeight() },
            scene, false, undefined, BABYLON.Constants.TEXTURETYPE_UNSIGNED_INT, false, BABYLON.Constants.TEXTURE_NEAREST_NEAREST);

        this.pickTexture.clearColor = COL_CLEAR_RGBA;
        scene.customRenderTargets.push(this.pickTexture);

        this.pickTexture.onBeforeRender = () => {
            if (engine.isRendering && MODE == 0 && tool.name !== 'camera')
                builder.mesh.thinInstanceSetBuffer("color", builder.rttColors, 4, true);
        }
        
        this.pickTexture.onAfterRender = () => {
            if (engine.isRendering && MODE == 0 && tool.name !== 'camera')
                builder.mesh.thinInstanceSetBuffer("color", builder.bufferColors, 4, true);
        }

        this.reflectionProbe = new BABYLON.ReflectionProbe('reflectionProbe', 512, scene);
        this.reflectionProbe.attachToMesh(new BABYLON.TransformNode('reflectionProbe'));
    }

    captureProbe(mesh) {
        this.reflectionProbe.renderList = [ mesh ];
        this.reflectionProbe.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        return this.reflectionProbe.cubeTexture.clone();
    }
}


// -------------------------------------------------------
// Light


class Light {
    constructor() {
        this.location = new BABYLON.Vector3(50, 100, 50);
        this.angle = 70;
        this.directional = null;

        this.init();
    }

    init() {
        this.directional = new BABYLON.DirectionalLight("directional", new BABYLON.Vector3(0, 0, -1), scene);
        this.directional.autoUpdateExtends = true;  // enable REFRESHRATE_RENDER_ONCE
        this.directional.position.copyFrom(this.location);
        this.directional.diffuse = BABYLON.Color3.FromHexString(document.getElementById('input-light-color').value);
        this.directional.intensity = document.getElementById('input-light-intensity').value;
        this.directional.shadowMaxZ = 2500;
        this.directional.shadowMinZ = -2500;
        this.directional.setDirectionToTarget(BABYLON.Vector3.Zero());
        this.setLightPositionByAngle(this.angle, this.location.x);
        scene.getNodeByName("shadowcatcher").material.activeLight = this.directional;

        const shadowGen = new BABYLON.ShadowGenerator(isMobile ? 512 : 1024, this.directional);
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
        material.updateCelMaterial();
    }
    
    updateAngle(angle) {
        this.setLightPositionByAngle(angle, this.location.x);
        this.updateShadowMap();
    }
    
    updateHeight(posY) {
        this.directional.position.y = posY;
        this.directional.setDirectionToTarget(BABYLON.Vector3.Zero());
        this.updateShadowMap();
    }
    
    updateIntensity(value) {
        this.directional.intensity = value;
        material.updateCelMaterial();
    }
    
    updateColor(hex) {
        this.directional.diffuse = BABYLON.Color3.FromHexString(hex).toLinearSpace();
        material.updateCelMaterial();
    }
    
    getDirection() {
        return this.directional.direction;
    }
    
    enableShadows(isEnabled) {
        scene.getNodeByName("shadowcatcher").isVisible = isEnabled;
        this.directional.shadowEnabled = isEnabled;
        if (MODE == 0) builder.create();
    }

    addMesh(mesh) {
        this.directional.getShadowGenerator().addShadowCaster(mesh);
    }

    setLightPositionByAngle(angle, dist) {
        scene.lights[1].position.x = Math.cos(angle * Math.PI / 180) * dist;
        scene.lights[1].position.z = Math.sin(angle * Math.PI / 180) * dist;
        scene.lights[1].setDirectionToTarget(BABYLON.Vector3.Zero());
    }
}


// -------------------------------------------------------
// Main Scene


class MainScene {
    constructor() {}

    create() {
        const scene = new BABYLON.Scene(engine.webgl);
        scene.clearColor = COL_CLEAR_RGBA;
        scene.autoClear = false;
        scene.autoClearDepthAndStencil = false;
        scene.blockMaterialDirtyMechanism = true;
        scene.collisionsEnabled = false;
        scene.useRightHandedSystem = true;
    
        const ambient = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 0, -1), scene);
        ambient.diffuse = new BABYLON.Color3(0.4, 0.4, 0.4);
        ambient.specular = new BABYLON.Color3(0.2, 0.2, 0.2);
        ambient.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        ambient.intensity = 0.4;
        
        const shadowcatcher = BABYLON.MeshBuilder.CreateGround("shadowcatcher", { width: 1000, height: 1000 }, scene);
        shadowcatcher.material = new BABYLON.ShadowOnlyMaterial('shadowcatcher', scene);
        shadowcatcher.material.shadowColor = BABYLON.Color3.FromHexString('#0D1117');
        //shadowcatcher.material.activeLight = light.directional; // define later
        shadowcatcher.material.backFaceCulling = true;
        shadowcatcher.material.alpha = 0.1;
        shadowcatcher.position.y = -0.5;
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
        this.view = [ 100, 100, 1, -1 ];
        
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

        const ambient = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 0, -1), this.scene);
        ambient.diffuse = BABYLON.Color3.White();
        ambient.groundColor = BABYLON.Color3.White();
        ambient.intensity = 1;

        const cam = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, BABYLON.Vector3.Zero(), this.scene);
        cam.viewport = updateViewport(this.view[0], this.view[1], this.view[2], this.view[3]);
        cam.radius = 5.2;
        cam.fov = 0.5;
        cam.alpha = scene.activeCamera.alpha;
        cam.beta = scene.activeCamera.beta;

        this.viewCube = BABYLON.MeshBuilder.CreateBox("viewcube", { size: 0.5 }, this.scene);
        this.viewCube.material = new BABYLON.NormalMaterial("viewcube", this.scene);
        this.viewCube.material.backFaceCulling = true;
        this.viewCube.material.freeze();
        this.viewCube.doNotSyncBoundingInfo = true;
        this.viewCube.doNotSerialize = true;
        this.viewCube.freezeWorldMatrix();
        this.viewCube.freezeNormals();

        const axisHelper = new BABYLON.AxesViewer(this.scene, 0.6, 0, null,null,null, 6);
        axisHelper.xAxis.getScene().materials[1].emissiveColor = COL_AXIS_X_RGB;
        axisHelper.yAxis.getScene().materials[2].emissiveColor = COL_AXIS_Y_RGB;
        axisHelper.yAxis.getScene().materials[3].emissiveColor = COL_AXIS_Z_RGB;
        axisHelper.xAxis.parent = this.viewCube;
        axisHelper.yAxis.parent = this.viewCube;
        axisHelper.zAxis.parent = this.viewCube;

        const axis = BABYLON.MeshBuilder.CreateSphere("viewaxes", { diameter: 0.65, segments: 6 }, this.scene);
        for (let i = 0; i < 6; i++) {
            const a = axis.clone();
            a.renderOverlay = true;
            a.renderOutline = true;
            a.outlineWidth = 0.05;
            a.overlayAlpha = 0.8;
            a.doNotSyncBoundingInfo = true;
            a.doNotSerialize = true;
            a.freezeNormals();
            this.viewAxes.push(a);
        }
        axis.dispose();

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
        this.scene.activeCamera.viewport = updateViewport(this.view[0], this.view[1], this.view[2], this.view[3]);
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
// Camera


class Camera {
    constructor() {
        this.camera0 = null;    // model
        this.camera1 = null;    // bake
        this.lastPos = [];
    }

    init(scene) {
        this.camera0 = new BABYLON.ArcRotateCamera("camera_model", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
        this.camera1 = new BABYLON.ArcRotateCamera("camera_bake", 0, 0, 10, BABYLON.Vector3.Zero(), scene);

        this.camera0.setPosition(new BABYLON.Vector3(100, 100, 100));
        this.camera0.setTarget(BABYLON.Vector3.Zero());
        this.camera0.lowerRadiusLimit = 1;
        this.camera0.upperRadiusLimit = 1500;
        this.camera0.lowerBetaLimit = 0.0001;   // fix ortho Y inaccuracy
        this.camera0.upperBetaLimit = Math.PI - 0.0001;
        this.camera0.wheelPrecision = 3;        // def 3
        this.camera0.pinchPrecision = 30;       // def 12
        this.camera0.panningSensibility = 300;  // def 1000
        this.camera0.inertia = 0.9;             // def 0.9
        //this.camera0.minZ = 0.01;
        //this.camera0.maxZ = 2000;
        this.camera0.fov = parseFloat(document.getElementById('input-camera-fov').value); //def: 0.8

        this.camera1.setPosition(new BABYLON.Vector3(73, 73, 73));
        this.camera1.setTarget(new BABYLON.Vector3(13, 13, 13));
        this.camera1.lowerRadiusLimit = 1;
        this.camera1.upperRadiusLimit = 1500;
        this.camera1.lowerBetaLimit = 0.0001;
        this.camera1.upperBetaLimit = Math.PI - 0.0001;
        this.camera1.wheelPrecision = 3;
        this.camera1.pinchPrecision = 30;
        this.camera1.panningSensibility = 300;
        this.camera1.inertia = 0.9;
        this.camera1.fov = parseFloat(document.getElementById('input-camera-fov').value);
    }

    switchCamera() {
        scene.activeCamera.detachControl(canvas);
        if (MODE == 0) {
            scene.activeCamera = this.camera0;
        } else if (MODE == 1) {
            scene.activeCamera = (ui.domRenderSource.value == 'model') ? this.camera0 : this.camera1;
        } else if (MODE == 2) {
            scene.activeCamera = this.camera1;
        }

        scene.activeCamera.attachControl(canvas, true);
        ui.domCameraFov.value = scene.activeCamera.fov;
    }

    frame() {
        if (MODE == 0) {
            this.setFramingBehavior(this.camera0, builder.mesh);
        } else if (MODE == 1) {
            modules.pt.frameCamera();
        } else if (MODE == 2) {
            if (bakery.meshes.length > 0) {
                if (bakery.selected) { // frame to selected mesh
                    this.setFramingBehavior(this.camera1, bakery.selected);
                } else {
                    const mesh = BABYLON.Mesh.MergeMeshes(bakery.meshes, false, true);
                    this.setFramingBehavior(this.camera1, mesh);
                    mesh.dispose();
                }
            } else {
                this.setFramingBehavior(this.camera1, builder.mesh);
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
        animator(cam, 'radius', cam.radius, f.radius);
        animator(cam, 'target', cam.target.clone(), f.target);
    }

    getFramed(mesh, offset = 2.2) {
        if (mesh) {
            mesh.computeWorldMatrix(true);
            const bounds = mesh.getBoundingInfo();

            const frustumSlopeY = Math.tan(scene.activeCamera.fov / 2);
            const frustumSlopeX = frustumSlopeY * scene.getEngine().getAspectRatio(scene.activeCamera);
            const radiusWithoutFraming = BABYLON.Vector3.Distance(bounds.boundingBox.minimumWorld, bounds.boundingBox.maximumWorld) * 0.5;
            
            if (radiusWithoutFraming > 20) offset = 1.3; // for larger scene
            if (radiusWithoutFraming < 2)  offset = 3.5; // for smaller scene
            const radius = radiusWithoutFraming * offset;
            const distanceForHorizontalFrustum = radius * Math.sqrt(1 + 1 / (frustumSlopeX * frustumSlopeX));
            const distanceForVerticalFrustum = radius * Math.sqrt(1 + 1 / (frustumSlopeY * frustumSlopeY));
            
            const lowerRadius = Math.max(distanceForHorizontalFrustum, distanceForVerticalFrustum);
            const radiusWorld = bounds.boundingBox.maximumWorld.subtract(bounds.boundingBox.minimumWorld).scale(0.5);
            return {
                radius: lowerRadius,
                target: bounds.boundingBox.minimumWorld.add(radiusWorld)
            };
        }
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
                position = new BABYLON.Vector3(1, 0, 0);
                break;
            case '-x':
                position = new BABYLON.Vector3(-1, 0, 0);
                break;
            case 'y':
                position = new BABYLON.Vector3(0, 1, 0);
                break;
            case '-y':
                position = new BABYLON.Vector3(0, -1, 0);
                break;
            case 'z':
                position = new BABYLON.Vector3(0, 0, 1);
                break;
            case '-z':
                position = new BABYLON.Vector3(0, 0, -1);
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
        const size = scene.activeCamera.radius / 2;
        const sizeY = size * scene.activeCamera.fov;
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
                this.lastPos[1] !== this.camera0.beta)
    }
}


// -------------------------------------------------------
// HDRI and Skybox


class HDRI {
    constructor() {
        this.hdrMap = null;
        this.hdrMapRender = null;
        this.skybox = null;
        this.isLoaded = false;
    }

    preload() { // TODO: BABYLON.HDRCubeTexture freeze and delay startup
        this.hdrMap = new BABYLON.HDRCubeTexture(ENVMAP, scene, 512, false, false, false, undefined, () => {
            this.createSkybox(this.hdrMap.clone(), parseFloat(ui.domHdriBlur.value));
            scene.environmentTexture = this.hdrMap;
        });

        modules.pt.loadHDR(ENVMAP, (tex) => {
            this.hdrMapRender = tex;
        });
    }

    loadHDR(url) {
        if (this.hdrMap)
            this.hdrMap.dispose();

        this.hdrMap = new BABYLON.HDRCubeTexture(url, scene, 512, false, false, false, undefined, () => {            
            this.showSkybox(ui.domHdriToggle.checked);

            if (this.skybox.material.reflectionTexture)
                this.skybox.material.reflectionTexture.dispose();
            this.skybox.material.reflectionTexture = this.hdrMap.clone();
            this.skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

            scene.environmentTexture = this.hdrMap;
            
            bakery.updateReflectionTextures();
            this.isLoaded = true;
        });

        modules.pt.loadHDR(url, (tex) => {
            this.hdrMapRender = tex;
            if (modules.pt.isActive)
                modules.pt.updateHDR();
        });
    }

    unloadHDR() {
        this.loadHDR(ENVMAP);
    }

    createSkybox(tex, blur, dist = 10000) {
        this.skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: dist }, scene);
        this.skybox.material = new BABYLON.PBRMaterial("skybox", scene);
        this.skybox.material.reflectionTexture = tex;
        this.skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        this.skybox.material.microSurface = 1.0 - blur;
        this.skybox.material.disableLighting = true;
        this.skybox.material.twoSidedLighting = true;
        this.skybox.material.backFaceCulling = false;
        this.skybox.layerMask = 0x00000000;
        this.skybox.isVisible = true;
        this.skybox.isPickable = false;
        this.skybox.rotation.y = -Math.PI / 2;
        this.skybox.infiniteDistance = true;
        this.skybox.ignoreCameraMaxZ = true;
        this.skybox.doNotSyncBoundingInfo = true;
        this.skybox.doNotSerialize = true;
        this.skybox.freezeWorldMatrix();
        this.skybox.freezeNormals();
    }

    showSkybox(isShow) {
        if (this.skybox)
            (isShow) ?
                this.skybox.layerMask = 0x0FFFFFFF :
                this.skybox.layerMask = 0x00000000;
    }

    setBlurAmount(num) {
        this.skybox.material.microSurface = 1.0 - num;
    }
}


// -------------------------------------------------------
// Material


class Material {
    constructor() {
        this.mode = 'CEL';
        this.mat_cel = null;
        this.mat_highlight = null;
        this.mat_pbr = null;
        this.mat_pbr_v = null;
        this.mat_workplane = null;
        this.mat_floor = null;
        this.mat_white = null;
        this.tex_pbr = null;
        this.textures = [];
        this.texId = 0; // last PBR texture
        
        this.init();
    }

    init() {
        for (let i = 0; i < TEX_PATTERNS.length; i++)
            this.textures.push(this.createTexture('texpat'+i, TEX_PATTERNS[i], BABYLON.Texture.LINEAR_LINEAR_MIPLINEAR));

        for (let i = 0; i < TEX_PRESETS.length; i++)
            this.addTexture(TEX_PRESETS[i]);

        this.texId = 3; // checker
        this.tex_pbr = this.textures[this.texId];

        this.createCelMaterial();
        this.createPBRMaterialVoxels();
        this.createPBRMaterial(true);
        this.createSTDMaterialHighlight();

        this.createWorkplaneMaterial();
        this.createFloorMaterial();
        this.createWhiteMaterial();
    }

    // This PBR can't have a reflection texture
    // because we texture mapping the thin-mesh per voxel
    createPBRMaterialVoxels() {
        const mat = new BABYLON.PBRMaterial("PBR_V", scene);
        mat.albedoColor = BABYLON.Color3.White();
        mat.albedoTexture = this.createVoxelTexture();
        mat.roughness = 0.9;
        mat.metallic = 0.1;
        mat.metallicF0Factor = 0;
        mat.backFaceCulling = true;
        mat.specularIntensity = 1;
        mat.directIntensity = 1;
        mat.environmentIntensity = 1;
        this.mat_pbr_v = mat;
    }

    createPBRMaterial(backFaceCulling = true) {
        if (this.mat_pbr) {
            this.mat_pbr.albedoTexture.dispose();
            if (this.mat_pbr.reflectionTexture)
                this.mat_pbr.reflectionTexture.dispose();
            this.mat_pbr.dispose();
        }
        const mat = new BABYLON.PBRMaterial("PBR", scene);
        mat.albedoColor = BABYLON.Color3.White();
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
        this.mat_pbr = mat;
    }

    createSTDMaterialHighlight() {
        const mat = new BABYLON.StandardMaterial("STD_highlight", scene);
        mat.diffuseColor = BABYLON.Color3.White(); // overrided
        mat.specularColor = BABYLON.Color3.Black();
        mat.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
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
        mat.mainColor = new BABYLON.Color3(0, 1, 1);
        mat.lineColor = new BABYLON.Color3(0, 1, 1);
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
        mat.mainColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        mat.lineColor = BABYLON.Color3.White();
        mat.backFaceCulling = true;
        this.mat_floor = mat;
    }

    createWhiteMaterial() {
        const mat = new BABYLON.StandardMaterial("white", scene);
        mat.disableLighting = true;
        mat.emissiveColor = BABYLON.Color3.White();
        mat.zOffset = -1;
        mat.freeze();
        this.mat_white = mat;
    }

    createVoxelTexture() {
        const tex = new BABYLON.DynamicTexture('voxelgrid', 256, scene, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        const ctx = tex.getContext();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 256, 256);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000EE';
        ctx.strokeRect(0, 0, 256, 256);
        tex.update();
        tex.hasAlpha = true;
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
        this.createPBRMaterial(ui.domBakeryBackFace.checked);
    }

    addTexture(data) {
        this.textures.push(this.createTexture('texpbr_user', data));
        const idx = this.textures.length - 1;
        this.setPBRTexture(idx);
        const li = document.createElement("li");
        li.classList.add("img");
        li.innerHTML = `<img data-bind="${ idx }" src="${ data }">`;
        li.addEventListener("pointerdown", () => {
            if (bakery.selected) {
                for (const i of ui.domTexturePresets.children)  // unselect presets
                    i.firstChild.style.borderColor = '#6b798d';
                li.firstChild.style.borderColor = COL_ORANGE;   // select preset

                this.setPBRTexture(idx);
                bakery.replaceTexture();
            } else {
                ui.notification('select a mesh');
            }
        }, false);
        ui.domTexturePresets.appendChild(li);
    }

    switchMaterial() {
        if (this.mode == 'CEL') {
            this.mode = 'PBR';
            builder.mesh.material = this.mat_pbr_v;
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
            return this.mat_pbr_v;
        }
    }

    createCelMaterial() {
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
            //varying float vDepth;

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
                //vDepth = 1.0 + gl_Position.w;
            }
        `;

        BABYLON.Effect.ShadersStore['celFragmentShader'] = `
            precision highp float;

            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec2 vUv;
            varying vec4 vColor;
            //varying float vDepth;

            uniform mat4 uCamMatrix;
            uniform vec3 uLightPos;
            uniform vec3 uLightCol;

            void main() {
                vec2 grid = abs(fract(vUv - 0.5) - 0.5) / fwidth(vUv);
                float line = min(grid.x, grid.y);
                line = 1.0 - min(line, 1.0);

                vec3 origin = vec3(uCamMatrix[3][0], uCamMatrix[3][1], uCamMatrix[3][2]);
                vec3 position = normalize(vPositionW);
                vec3 normal = normalize(vNormalW);
                vec3 viewDir = normalize(origin - position);
                vec3 lightDir = normalize(uLightPos - position);
                //float depth = 1.0 - vDepth * 0.001;

                float amb = clamp(0.5 + 0.5 * normal.y, 0.0, 1.0);
                float dif = max(dot(normal, lightDir), 0.0);
                float inv = max(dot(normal, -lightDir), 0.0);
                float spp = max(dot(reflect(-lightDir, normal), viewDir), 0.0);
		        float spc = pow(spp, 8.0);

                if (dot(normal, lightDir) < 0.0)
                    amb *= 2.0;

                vec3 brdf = vec3(0);
                brdf += 0.5 * amb * vec3(1);
                brdf += 1.0 * dif * uLightCol;
                brdf += 0.4 * inv * uLightCol;
                brdf += 0.6 * spc * vec3(1);

                vec3 col = pow(vColor.rgb * vColor.rgb, vec3(0.4545));
                col = mix(col, vec3(0), line * 0.16);
                col *= brdf;
                col = pow(col, vec3(0.4545));

                gl_FragColor = vec4(col, 1.0);
            }
        `;

        this.mat_cel = new BABYLON.ShaderMaterial('CEL', scene, {
                vertex: "cel", fragment: "cel",
            }, {
                attributes: [ "position", "normal", "uv", "color" ],
                uniforms:   [ "world", "worldView", "worldViewProjection", "view", "projection", "viewProjection",
                              "uCamMatrix", "uLightPos", "uLightCol" ],
                needAlphaBlending: false,
                needAlphaTesting: false
            }
        );

        this.updateCelMaterial();
    }

    updateCelMaterial() {
        if (this.mat_cel) {
            this.mat_cel.setMatrix("uCamMatrix", camera.camera0.getWorldMatrix());
            this.mat_cel.setVector3("uLightPos", light.directional.position);
            this.mat_cel.setColor3("uLightCol", new BABYLON.Color3(
                light.directional.diffuse.r * light.directional.intensity,
                light.directional.diffuse.g * light.directional.intensity,
                light.directional.diffuse.b * light.directional.intensity
            ));
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
        this.tMatrix = BABYLON.Matrix.Identity();

        this.rttColors = [];
        this.rttColorsMap = [];
        this.positionsMap = [];

        this.init();
    }

    init() {
        this.voxel = BABYLON.MeshBuilder.CreateBox("voxel", { size: 1, updatable: false }, scene);
        this.voxel.isVisible = false;
        this.voxel.isPickable = false;
        this.voxel.receiveShadows = true;
        this.voxel.doNotSerialize = true;
        this.voxel.freezeWorldMatrix();
        this.voxel.freezeNormals();

        this.vPositions = this.voxel.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        this.vNormals = this.voxel.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        this.vUvs = this.voxel.getVerticesData(BABYLON.VertexBuffer.UVKind);
        this.vIndices = this.voxel.getIndices();

        this.mesh = this.voxel.clone();
    }

    create(updateFloor = true) {
        if (this.voxels.length == 0)
            generator.newBox(1, COL_ICE);

        this.isWorking = true;
        this.createThinInstances();

        renderTarget.pickTexture.renderList = [ this.mesh ];
        renderTarget.pickTexture.setMaterialForRendering(this.mesh, material.mat_white);

        setTimeout(() => {
            if (bvhWhiteList.includes(tool.name))
                modules.rc.create();
            this.isWorking = false;
        });

        light.addMesh(this.mesh);
        light.updateShadowMap();
        
        setTimeout(() => {
            palette.create();
            helper.setSymmPivot();
            if (updateFloor) helper.setFloor();

            modules.ws_client.sendMessage(this.voxels, 'get');
        }, 10);
    }

    createThinInstances(voxels = this.voxels) {
        this.bufferMatrix = new Float32Array(16 * voxels.length);
        this.bufferColors = new Float32Array(4 * voxels.length);
        this.rttColors = new Float32Array(4 * voxels.length);
        this.rttColorsMap = new Array(voxels.length);
        this.positionsMap = new Array(voxels.length);

        for (let i = 0; i < voxels.length; i++) {
            if (this.getIndexAtPosition(voxels[i].position) > -1) {
                voxels[i].position = DUPLICATE_POS; // flag duplicates for removal
                voxels[i].visible = false;
                duplicateFlag = 1;
            }
            
            this.tMatrix = BABYLON.Matrix.Translation(voxels[i].position.x, voxels[i].position.y, voxels[i].position.z);
            if (!voxels[i].visible)
                this.tMatrix = this.tMatrix.multiply(BABYLON.Matrix.Scaling(0, 0, 0));
            this.tMatrix.copyToArray(this.bufferMatrix, i * 16);

            const col = hexToRgbFloat(voxels[i].color, 2.2);
            this.bufferColors[i * 4] = col.r;
            this.bufferColors[i * 4 + 1] = col.g;
            this.bufferColors[i * 4 + 2] = col.b;
            this.bufferColors[i * 4 + 3] = 1;

            const [rttR, rttG, rttB] = numToColor(i);
            this.rttColors[i * 4] = rttR / 255;
            this.rttColors[i * 4 + 1] = rttG / 255;
            this.rttColors[i * 4 + 2] = rttB / 255;
            this.rttColors[i * 4 + 3] = 1;
            this.rttColorsMap[`${rttR}_${rttG}_${rttB}`] = i;

            this.voxels[i].idx = i;
            this.positionsMap[`${voxels[i].position.x}_${voxels[i].position.y}_${voxels[i].position.z}`] = i;
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
        //this.mesh.thinInstanceRefreshBoundingInfo();

        this.bufferWorld = this.mesh.thinInstanceGetWorldMatrices();
        this.bufferMatrix = [];
    }

    fillArrayBuffers() { // for raycaster, pathtracer and export
        this.positions = new Float32Array(this.vPositions.length * this.voxels.length);
        this.uvs = new Float32Array(this.vUvs.length * this.voxels.length);
        this.colors = new Float32Array(this.vUvs.length * 2 * this.voxels.length);
        this.indices = new Uint32Array(this.vIndices.length * this.voxels.length);

        const lenC = this.vUvs.length * 2;
        const p = new BABYLON.Vector3();
        let v = 0;

        for (let i = 0; i < this.voxels.length; i++) {
            for (v = 0; v < this.vPositions.length; v += 3) {
                p.x = this.vPositions[v];
                p.y = this.vPositions[v + 1];
                p.z = this.vPositions[v + 2];
                const m = this.bufferWorld[i].m; // Vector3.TransformCoordinates
                const rx = p.x * m[0] + p.y * m[4] + p.z * m[8] + m[12];  // multiply matrix to
                const ry = p.x * m[1] + p.y * m[5] + p.z * m[9] + m[13];  // get the scaling
                const rz = p.x * m[2] + p.y * m[6] + p.z * m[10] + m[14]; // to support visibility
                const rw = 1 / (p.x * m[3] + p.y * m[7] + p.z * m[11] + m[15]);
                this.positions[i * this.vPositions.length + v] = rx * rw;
                this.positions[i * this.vPositions.length + v + 1] = ry * rw;
                this.positions[i * this.vPositions.length + v + 2] = rz * rw;
            }

            for (v = 0; v < this.vUvs.length; v += 2) {
                this.uvs[i * this.vUvs.length + v] = this.vUvs[v];
                this.uvs[i * this.vUvs.length + v + 1] = this.vUvs[v + 1];
                this.colors[i * lenC + v * 2] = this.bufferColors[i * 4];
                this.colors[i * lenC + v * 2 + 1] = this.bufferColors[i * 4 + 1];
                this.colors[i * lenC + v * 2 + 2] = this.bufferColors[i * 4 + 2];
                this.colors[i * lenC + v * 2 + 3] = 1;
            }

            const lenI = this.vPositions.length / 3;
            const len = i * this.vIndices.length;
            for (v = 0; v < this.vIndices.length; v++) {
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
        mesh.material = material.mat_pbr;
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
        return new BABYLON.Vector3(
            Math.abs(bounds.minimum.x - bounds.maximum.x),
            Math.abs(bounds.minimum.y - bounds.maximum.y),
            Math.abs(bounds.minimum.z - bounds.maximum.z)
        );
    }

    getIndexAtPointer() {       // GPU color-picking method
        const x = Math.round(scene.pointerX);   // translated from Three.js by @kikoshoung
        const y = engine.webgl.getRenderHeight() - Math.round(scene.pointerY);
        const pixels = readTexturePixels(engine.webgl._gl, renderTarget.pickTexture._texture._hardwareTexture.underlyingResource, x, y, 1, 1);
        const colorId = `${pixels[0]}_${pixels[1]}_${pixels[2]}`;
        if (this.bufferWorld[this.rttColorsMap[colorId]])
            return this.rttColorsMap[colorId];
        return -1;
    }

    getIndexAtPosition(pos) {
        return this.positionsMap[`${pos.x}_${pos.y}_${pos.z}`];
    }

    getIndexAtXYZ(x, y, z) {
        return this.positionsMap[`${x}_${y}_${z}`];
    }

    getVoxelAtPosition(pos) {
        const idx = this.getIndexAtPosition(pos);
        if (idx > -1)
            return this.voxels[idx];
        return undefined;
    }

    getVoxelAtXYZ(x, y, z) {
        const idx = this.getIndexAtXYZ(x, y, z);
        if (idx > -1)
            return this.voxels[idx];
        return undefined;
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

    getVoxelsVisibilityByColor(hex) {
        const idx = this.findIndexByColor(hex);
        if (idx > -1)
            return this.voxels[idx].visible;
        return false;
    }

    findIndexByPosition(pos) { // no dup
        return this.voxels.findIndex(i =>
            i.position.x == pos.x &&
            i.position.y == pos.y &&
            i.position.z == pos.z);
    }

    findIndexByColor(hex) { // no dup
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

    async setAllColorsAndUpdate(hex = currentColor) {
        if (!await ui.showConfirm('replace all colors?')) return;
        for (let i = 0; i < this.voxels.length; i++) {
            this.voxels[i].visible = true;
            this.voxels[i].color = hex;
        }
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

    async deleteHiddenAndUpdate() {
        const hiddens = this.getVoxelsByVisibility(false);

        if (hiddens.length == 0) return;
        if (!await ui.showConfirm('delete hidden voxels?')) return;
        
        this.removeArray(hiddens);
        this.create();
        this.update();
    }

    async reduceVoxels() {
        if (!await ui.showConfirm('reducing voxels, continue?')) return;
        displayLoading(true);
        const last = this.voxels.length;
        const msg = await modules.workerPool.postMessage({ id: 'findInnerVoxels', data: [ this.voxels, this.positionsMap ] });
        if (msg) {
            this.voxels = [];
            for (let i = 0; i < msg.data.length; i++) {
                this.add(new BABYLON.Vector3(
                    msg.data[i].position._x, msg.data[i].position._y, msg.data[i].position._z),
                    msg.data[i].color, msg.data[i].visible);
            }
            this.create();
            this.update();
            ui.notification(`${ last - this.voxels.length } voxels removed`);
            displayLoading(false);
        } else {
            ui.notification('unable to reduce voxels');
            displayLoading(false);
        }
    }

    removeDuplicates() {
        //const last = this.voxels.length;
        this.removeByPosition(DUPLICATE_POS);
        this.create();
        //console.log(`remove ${ last - this.voxels.length } duplicates`);
    }

    async normalizeVoxelPositions(isRecordMem) {
        if (isRecordMem && !await ui.showConfirm('normalize voxel positions?')) return;
        const bounds = this.mesh.getBoundingInfo();
        const size = getMeshSize(bounds);
        const center = bounds.boundingBox.center;
        const nX = (-bounds.maximum.x + (size.x / 2)) + (size.x / 2) - 0.5;
        const nY = ((size.y / 2) - center.y) - 0.5;
        const nZ = (-bounds.maximum.z + (size.z / 2)) + (size.z / 2) - 0.5;
        for (let i = 0; i < this.voxels.length; i++) {
            this.voxels[i].position = BABYLON.Vector3.TransformCoordinates(
                this.voxels[i].position,
                BABYLON.Matrix.Translation(nX, nY, nZ));
        }
        this.create();
        if (isRecordMem) {
            this.update();
            ui.notification('normalized');
        }
    }

    // voxel-data io

    getData() {
        return JSON.stringify(this.voxels);
    }

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

    setData(data) {
        const voxels = JSON.parse(data);
        const newData = [];
        for (let i = 0; i < voxels.length; i++) {
            newData.push({ 
                position: new BABYLON.Vector3(
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

    setDataFromString(data) {
        const voxels = data.split(';').slice(0, -1);
        const newData = [];
        for (let i = 0; i < voxels.length; i++) {
            const chunk = voxels[i].split(',');
            newData.push({
                position: new BABYLON.Vector3(
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
        const tmparr = [];
        let v;
        for (let i = 0; i < positions.length; i++) {
            v = this.getVoxelAtPosition(positions[i]);
            if (v) tmparr.push(v);

            if (isSymmetry) {
                v = this.getVoxelAtPosition(symmetry.invertPos(positions[i]));
                if (v) tmparr.push(v);
            }
        }
        return tmparr;
    }

    createArrayFromNewPositions(positions, hex, isSymmetry) {
        const tmparr = [];
        for (let i = 0; i < positions.length; i++) {
            tmparr.push({
                position: positions[i],
                color: hex,
                visible: true
            });

            if (isSymmetry) {
                tmparr.push({
                    position: symmetry.invertPos(positions[i]),
                    color: hex,
                    visible: true
                });
            }
        }
        return tmparr;
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
                if (!ui.domTransformClone.checked)
                    builder.voxels[ voxels[i].idx ].visible = false;
            }
        }

        if (!ui.domTransformClone.checked)
            builder.create(false);

        this.isActive = true;
    }

    finish() {
        if (this.isActive) {
            const p = this.root.position.subtract(this.startPos);

            if (!p.equals(BABYLON.Vector3.Zero())) { // change on move
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
            
            this.isActive = false;
            this.isNewObject = false;

            builder.create();
            builder.update();

            uix.unbindVoxelGizmo();
            
            ghosts.thin.setParent(null);
            ghosts.disposeThin();
            
            this.origins = [];
            this.indexes = [];
        }
    }

    cancel() {
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
                this.cancel();
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
        this.voxel = null;
        this.thin = null;
        this.sps = null;
        this.cloud = null;
        this.bufferMatrix = [];
        this.bufferColors = [];
        this.tMatrix = BABYLON.Matrix.Identity();

        this.init();
    }

    init() {
        this.voxel = BABYLON.MeshBuilder.CreateBox("ghost_voxel", { size: 1, updatable: false }, scene);
        this.voxel.isVisible = false;
        this.voxel.isPickable = false;
        this.voxel.receiveShadows = false;
        this.voxel.doNotSerialize = true;
        this.voxel.material = material.mat_highlight;
        this.voxel.freezeWorldMatrix();
        this.voxel.freezeNormals();

        this.disposeThin(); // init
    }

    createThin(voxels) {
        if (voxels.length == 0) return;

        if (this.thin)
            this.thin.dispose();

        this.bufferMatrix = new Float32Array(16 * voxels.length);
        this.bufferColors = new Float32Array(4 * voxels.length);

        for (let i = 0; i < voxels.length; i++) {
            this.tMatrix = BABYLON.Matrix.Translation(voxels[i].position.x, voxels[i].position.y, voxels[i].position.z);
            if (!voxels[i].visible)
                this.tMatrix = this.tMatrix.multiply(BABYLON.Matrix.Scaling(0, 0, 0));
            this.tMatrix.copyToArray(this.bufferMatrix, i * 16);
        }

        this.bufferColors.fill(1);
    
        this.thin = this.voxel.clone();
        this.thin.makeGeometryUnique();
        this.thin.thinInstanceSetBuffer("matrix", this.bufferMatrix, 16, true);
        this.thin.thinInstanceSetBuffer("color", this.bufferColors, 4, true);
        this.thin.isVisible = true;
        this.thin.material.diffuseColor = BABYLON.Color3.White();

        // TODO: visual artifacts with thin-instances
        highlightOverlayMesh(this.thin, COL_ORANGE_RGB);
        highlightOutlineMesh(this.thin, COL_ORANGE_RGBA);

        light.addMesh(this.thin);
        light.updateShadowMap();

        this.bufferMatrix = [];
        this.bufferColors = [];
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

        this.sps.addShape(this.voxel, voxels.length, { positionFunction: (particle, i, s) => {
            particle.position.copyFrom(voxels[i].position);
            //particle.color = BABYLON.Color4.FromHexString(voxels[i].color);
            if (!voxels[i].visible) particle.scaling.set(0,0,0);
        }});

        this.sps.initParticles();
        this.sps.buildMesh();
        this.sps.computeBoundingBox = false;
        this.sps.mesh.isPickable = true;
        this.sps.mesh.doNotSerialize = true;
        this.sps.mesh.layerMask = 0x00000000;
        this.sps.mesh.freezeNormals();
    }

    disposeSPS() {
        if (this.sps)
            this.sps.dispose();
        this.sps = null;
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
            particle.color = BABYLON.Color4.FromHexString(voxels[s].color);
        };

        this.cloud.addPoints(voxels.length, setParticles);
        this.cloud.buildMeshAsync().then((mesh) => {
            mesh.visibility = 0.35;
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

    addThin(pos, hex) {
        this.thin.isVisible = true;
        this.thin.material.diffuseColor = BABYLON.Color3.FromHexString(hex);
        this.thin.thinInstanceAdd(BABYLON.Matrix.Translation(pos.x, pos.y, pos.z));
    }

    getCenter() {
        return this.thin.getBoundingInfo().boundingSphere.centerWorld;
    }
}


// -------------------------------------------------------
// Palette


class Palette {
    constructor() {
        this.size = 30;
        this.ctx = canvasPalette.getContext('2d', { willReadFrequently: true });
        this.uniqueColors = [];
        
        this.init();
    }
    
    init() {
        canvasPalette.width = canvasPalette.clientWidth;
        canvasPalette.height = canvasPalette.clientHeight;

        canvasPalette.addEventListener("pointerdown", (ev) => {
            const hex = getCanvasColor(this.ctx, ev.offsetX, ev.offsetY);
            if (hex) {
                if (this.uniqueColors.includes(hex)) {
                    currentColor = hex;
                    uix.colorPicker.value = BABYLON.Color3.FromHexString(hex);
                }
            }
        }, false);
                
        canvasPalette.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            const hex = getCanvasColor(this.ctx, ev.offsetX, ev.offsetY);
            if (hex && this.uniqueColors.includes(hex))
                builder.setVoxelsVisibilityByColor(hex, !builder.getVoxelsVisibilityByColor(hex));
        }, false);

        canvasPalette.addEventListener("dblclick", (ev) => {
            const hex = getCanvasColor(this.ctx, ev.offsetX, ev.offsetY);
            if (hex && this.uniqueColors.includes(hex))
                builder.setVoxelsVisibilityByColor(hex, !builder.getVoxelsVisibilityByColor(hex));
        }, false);

        new ResizeObserver(() => {
            this.create();
        }).observe(canvasPalette);
    }

    create(pad = 2) {
        const wPad = this.size + pad;
        const wPadSize = wPad * parseInt(preferences.getPaletteSize());

        ui.domPalette.style.width = 8 + wPadSize + "px";
        canvasPalette.width = canvasPalette.clientWidth;
        canvasPalette.height = canvasPalette.clientHeight;

        this.uniqueColors = [];
        let col = 0;
        let row = pad;
        for (let i = 0; i < builder.voxels.length; i++) {
            if (this.uniqueColors.indexOf(builder.voxels[i].color) == -1) {
                this.addColor(col + pad, row, builder.voxels[i].color);
                this.uniqueColors.push(builder.voxels[i].color);
                col += wPad;
                if (col >= wPadSize) {
                    col = 0;
                    row += this.size + pad;
                }
            }
        }
    }

    expand(num, pad = 2) {
        ui.domPalette.style.width = 8 + ((this.size + pad) * num) + "px";
        canvasPalette.width = ui.domPalette.clientWidth;
    }
    
    addColor(x, y, hex) {
        this.ctx.strokeStyle = 'transparent';
        if (!builder.getVoxelsVisibilityByColor(hex)) {
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'orange';
            this.ctx.strokeRect(x, y, this.size, this.size);
        }
        this.ctx.fillStyle = hex;
        this.ctx.fillRect(x, y, this.size, this.size);
    }
}


// -------------------------------------------------------
// Helper


class Helper {
    constructor() {
        this.floorPlane = BABYLON.MeshBuilder.CreatePlane("floorplane", { width: 4, height: 4, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, scene);
        this.gridPlane = BABYLON.MeshBuilder.CreatePlane("gridplane", { size: 2500, sideOrientation: BABYLON.Mesh.BACKSIDE, updatable: false }, scene);
        this.workplane = BABYLON.MeshBuilder.CreatePlane("workplane", { size: WORKPLANE_SIZE, sideOrientation: BABYLON.Mesh.BACKSIDE, updatable: false }, scene);
        this.axisPlane = BABYLON.MeshBuilder.CreatePlane("axisplane", { size: 1.1, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, axisView.scene);
        this.overlayPlane = BABYLON.MeshBuilder.CreatePlane("overlay_plane", { sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, scene);
        this.overlayCube = BABYLON.MeshBuilder.CreateBox("overlay_cube", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
        this.boxShape = BABYLON.MeshBuilder.CreateBox("boxshape", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
        this.boxShapeSymm = BABYLON.MeshBuilder.CreateBox("boxshapesymm", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
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
        this.axisPlane.visibility = 0.3;
        this.axisPlane.doNotSerialize = true;
        highlightOverlayMesh(this.axisPlane, COL_AQUA_RGB); // overrided
        this.axisPlane.edgesWidth = 6;
        this.axisPlane.edgesColor = COL_AQUA_RGBA;
        this.axisPlane.enableEdgesRendering();
        this.axisPlane.freezeNormals();

        this.overlayPlane.isVisible = false;
        this.overlayPlane.isPickable = false;
        this.overlayPlane.visibility = 0.01;
        this.overlayPlane.doNotSerialize = true;
        highlightOverlayMesh(this.overlayPlane, COL_ORANGE_RGB, 1);
        this.overlayPlane.freezeNormals();

        this.overlayCube.isVisible = false;
        this.overlayCube.isPickable = false;
        this.overlayCube.visibility = 0.1;
        this.overlayCube.doNotSerialize = true;
        highlightOverlayMesh(this.overlayCube, COL_ORANGE_RGB);
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
        this.workplane = BABYLON.Mesh.MergeMeshes(wpVol, true, true);
        this.workplane.name = 'workplane';
        resetPivot(this.workplane);
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
        highlightOverlayMesh(this.boxShape, COL_ORANGE_RGB);
        highlightEdgesMesh(this.boxShape, COL_ORANGE_RGBA);
        this.boxShape.freezeNormals();

        this.boxShapeSymm.renderingGroupId = 1;
        this.boxShapeSymm.isVisible = false;
        this.boxShapeSymm.isPickable = false;
        this.boxShapeSymm.visibility = 0.1;
        this.boxShapeSymm.doNotSerialize = true;
        highlightEdgesMesh(this.boxShapeSymm, COL_AQUA_RGBA);
        this.boxShapeSymm.edgesColor.a = 0.4;
        this.boxShapeSymm.freezeNormals();

        const r = Math.max(10, ~~builder.getRadius());
        const axisLines = [
            [ BABYLON.Vector3.Zero(), new BABYLON.Vector3(r, 0, 0) ],
            [ BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, r, 0) ],
            [ BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, r) ]
        ];
        const axisColors = [
            [ COL_AXIS_X_RGBA, COL_AXIS_X_RGBA ],
            [ COL_AXIS_Y_RGBA, COL_AXIS_Y_RGBA ],
            [ COL_AXIS_Z_RGBA, COL_AXIS_Z_RGBA ]
        ];
        this.symmPivot = BABYLON.MeshBuilder.CreateLineSystem("symmpivot", { lines: axisLines, colors: axisColors, useVertexAlpha: true, updatable: false }, uix.utilLayer.utilityLayerScene);
        this.symmPivot.isVisible = false;
        this.symmPivot.doNotSerialize = true;
    }

    setFloor() {
        const r = camera.getFramed(builder.mesh).radius;
        this.floorPlane.scaling.x = r;
        this.floorPlane.scaling.y = r;
        this.floorPlane.scaling.z = 1;
        this.floorPlane.material.gridRatio = 1 / r;
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
                this.symmPivot.position = BABYLON.Vector3.Zero();
                this.symmPivot.position.x -= 0.5;
                this.symmPivot.position.y -= 0.5;
                this.symmPivot.position.z -= 0.5;
            } else { // local
                this.symmPivot.position = builder.getCenter();
            }

            this.symmPivot.scaling = BABYLON.Vector3.One();
            if (symmetry.axis == BABYLON.Axis.X) this.symmPivot.scaling.x *= 2.2;
            if (symmetry.axis == BABYLON.Axis.Y) this.symmPivot.scaling.y *= 2.2;
            if (symmetry.axis == BABYLON.Axis.Z) this.symmPivot.scaling.z *= 2.2;
        }
    }

    setAxisPlane(axis, pos) {
        this.axisPlane.isVisible = true;
        this.axisPlane.position = pos;
        this.axisPlane.rotation = BABYLON.Vector3.Zero();
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
    }

    toggleAxisPlane(isVisible) {
        this.axisPlane.isVisible = isVisible;
        this.symmPivot.isVisible = isVisible;
    }

    setOverlayPlane(pos, normAxis) {
        this.overlayPlane.isVisible = true;
        this.overlayPlane.position = pos;
        this.overlayPlane.rotationQuaternion = BABYLON.Quaternion.RotationAxis(
            BABYLON.Vector3.Cross(BABYLON.Axis.Z, normAxis),         // axis
            Math.acos(BABYLON.Vector3.Dot(normAxis, BABYLON.Axis.Z)) // angle
        );
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
        fixEdgesWidth(this.boxShape);
    }

    setBoxShapeSymmetry(pos, scale, color) {
        this.boxShapeSymm.isVisible = true;
        this.boxShapeSymm.position = pos;
        this.boxShapeSymm.scaling = scale;
        this.boxShapeSymm.overlayColor = color;
        fixEdgesWidth(this.boxShapeSymm);
    }

    updateBoxShape(hex) {
        this.boxShape.overlayColor = BABYLON.Color3.FromHexString(hex);
    }

    clearBoxShape() {
        this.boxShape.isVisible = false;
        this.boxShape.position = BABYLON.Vector3.Zero();
        this.boxShape.scaling = BABYLON.Vector3.Zero();
        this.boxShapeSymm.isVisible = false;
        this.boxShapeSymm.position = BABYLON.Vector3.Zero();
        this.boxShapeSymm.scaling = BABYLON.Vector3.Zero();
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

        this.VEC3_2 = new BABYLON.Vector3(2, 2, 2);
        this.DIRECTIONS = [
            new BABYLON.Vector3(1, 0, 0),
            new BABYLON.Vector3(-1, 0, 0),
            new BABYLON.Vector3(0, 1, 0),
            new BABYLON.Vector3(0, -1, 0),
            new BABYLON.Vector3(0, 0, 1),
            new BABYLON.Vector3(0, 0, -1)
        ];

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
        this.selected.push(pos);
        ghosts.addThin(pos, COL_RED);

        if (this.isSymmetry) {
            pos = symmetry.invertPos(pos);
            this.selected.push(pos);
            ghosts.addThin(pos, COL_RED);
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
        uix.colorPicker.value = BABYLON.Color3.FromHexString(currentColor);
    }

    boxShape(start, end, color) {
        if (end.x <= start.x && end.y <= start.y && end.z <= start.z) {
            this.box.sX = end.x;      this.box.eX = start.x;
            this.box.sY = end.y;      this.box.eY = start.y;
            this.box.sZ = end.z;      this.box.eZ = start.z;
        }
        else if (start.x <= end.x && start.y <= end.y && start.z <= end.z) {
            this.box.sX = start.x;    this.box.eX = end.x;
            this.box.sY = start.y;    this.box.eY = end.y;
            this.box.sZ = start.z;    this.box.eZ = end.z;
        }

        else if (end.x <= start.x && start.y <= end.y && end.z <= start.z) {
            this.box.sX = end.x;      this.box.eX = start.x;
            this.box.sY = start.y;    this.box.eY = end.y;
            this.box.sZ = end.z;      this.box.eZ = start.z;
        }
        else if (start.x <= end.x && end.y <= start.y && start.z <= end.z) {
            this.box.sX = start.x;    this.box.eX = end.x;
            this.box.sY = end.y;      this.box.eY = start.y;
            this.box.sZ = start.z;    this.box.eZ = end.z;
        }

        else if (start.x <= end.x && end.y <= start.y && end.z <= start.z) {
            this.box.sX = start.x;    this.box.eX = end.x;
            this.box.sY = end.y;      this.box.eY = start.y;
            this.box.sZ = end.z;      this.box.eZ = start.z;
        }
        else if (end.x <= start.x && start.y <= end.y && start.z <= end.z) {
            this.box.sX = end.x;      this.box.eX = start.x;
            this.box.sY = start.y;    this.box.eY = end.y;
            this.box.sZ = start.z;    this.box.eZ = end.z;
        }

        else if (start.x <= end.x && start.y <= end.y && end.z <= start.z) {
            this.box.sX = start.x;    this.box.eX = end.x;
            this.box.sY = start.y;    this.box.eY = end.y;
            this.box.sZ = end.z;      this.box.eZ = start.z;
        }
        else if (end.x <= start.x && end.y <= start.y && start.z <= end.z) {
            this.box.sX = end.x;      this.box.eX = start.x;
            this.box.sY = end.y;      this.box.eY = start.y;
            this.box.sZ = start.z;    this.box.eZ = end.z;
        }

        const scale = new BABYLON.Vector3(1 + this.box.eX - this.box.sX, 1 + this.box.eY - this.box.sY, 1 + this.box.eZ - this.box.sZ);

        helper.setBoxShape(start.add(end).divide(this.VEC3_2), scale, color);
        
        if (this.isSymmetry) {
            helper.setBoxShapeSymmetry(
                symmetry.invertPos(start).add(symmetry.invertPos(end)).divide(this.VEC3_2),
                scale, color);
        }

        this.boxCount = helper.boxShape.scaling.x * helper.boxShape.scaling.y * helper.boxShape.scaling.z;
        if (this.boxCount > MAX_VOXELS_DRAW)
            helper.updateBoxShape(COL_RED);
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
                    if (!builder.getVoxelAtXYZ(x, y, z))
                        this.selected.push(new BABYLON.Vector3(x, y, z));
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
                    if (builder.getVoxelAtXYZ(x, y, z))
                        this.selected.push(new BABYLON.Vector3(x, y, z));
                }
            }
        }
    }

    getVoxelsFromRectangleSelection(start) {
        const end = { x: scene.pointerX, y: scene.pointerY };
        const minX = Math.min(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxX = Math.max(start.x, end.x);
        const maxY = Math.max(start.y, end.y);
        ui.domMarquee.style.top = minY + 'px';
        ui.domMarquee.style.left = minX + 'px';
        ui.domMarquee.style.width = maxX - minX + 'px';
        ui.domMarquee.style.height = maxY - minY + 'px';
        
        return builder.voxels.filter((i) => 
            isTargetIn(start, end, i.position, camera.camera0));
    }

    rectSelect(start) {
        this.selected = this.getVoxelsFromRectangleSelection(start);
        this.selected = this.selected.filter((i) => i.visible);
        ghosts.createThin(this.selected);
    }

    rectSelectFirst(start, norm, pick) {
        this.tmp = this.getVoxelsFromRectangleSelection(start);

        this.selected = [];
        for (let i = 0; i < this.tmp.length; i++) {
            if (this.tmp[i].visible) {
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
        }

        ghosts.createThin(this.selected);
    }

    pickWorkplane(pick, norm) {
        norm.z = parseInt(norm.z.toFixed(1)); // fix normal precision

        const pos = pick.pickedPoint.add(BABYLON.Vector3.One()).subtract(new BABYLON.Vector3(0.5,0.5,0.5)).floor();

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
                bakery.bakeColor(builder.voxels[index].color);
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
                    this.boxSelectAdd(this.startBox, this.posNorm, BABYLON.Color3.FromHexString(currentColor));
                break;
            case 'box_remove':
                if (this.startBox)
                    this.boxSelect(this.startBox, this.pos, this.posNorm, COL_ORANGE_RGB);
                break;
            case 'box_paint':
                if (this.startBox)
                    this.boxSelect(this.startBox, this.pos, this.posNorm, BABYLON.Color3.FromHexString(currentColor));
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
        if (this.name !== 'camera' && !camera.isCameraChange() && !builder.isWorking) {
            scene.activeCamera.attachControl(canvas, true);
            this.setPickInfo(pickInfo, (p) => {
                scene.stopAnimation(camera.camera0);
                scene.activeCamera.detachControl(canvas);
                this.onToolDown(p);
            });
        }
    }

    handleToolMove(pickInfo) {
        if (this.name !== 'camera' && !camera.isCameraChange() && !builder.isWorking) {
            this.now = performance.now();
            this.elapsed = this.now - this.then;
            if (this.elapsed > FPS) {
                this.then = this.now - (this.elapsed % FPS);
                this.setPickInfo(pickInfo, (p) => {
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

            ghosts.disposeThin();
            helper.clearBoxShape();
            setTimeout(() => { // prevent last overlay in touchscreen
                helper.clearOverlays();
            }, 10);

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
        return mesh == ghosts.sps.mesh;
    }

    // invented an unusual method to find picking-normal with a magnetic probe
    normalProbe(p) {
        let norm = undefined;
        this.tmpsps = [];

        this.tmpsps.push({ position: p, color: COL_RED, visible: true });
        for (let i = 0; i < this.DIRECTIONS.length; i++) {
            const pos = p.add(this.DIRECTIONS[i]);
            const idx = builder.getIndexAtPosition(pos);
            if (idx > -1)
                this.tmpsps.push({ position: pos, color: COL_RED, visible: builder.voxels[idx].visible });
        }

        ghosts.createSPS(this.tmpsps);
        const pick = scene.pick(scene.pointerX, scene.pointerY, this.predicateSPS);
        if (pick && pick.hit)
            norm = pick.getNormal(true);
        ghosts.disposeSPS();
        
        this.tmpsps = [];
        return norm;
    }

    setPickInfo(pick, onHit) {
        const index = builder.getIndexAtPointer();

        if (index > -1) {
            const norm = this.normalProbe(builder.voxels[index].position);
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

        scene.activeCamera.attachControl(canvas, true);
        helper.clearOverlays();

        if (finishTransforms)
            xformer.apply();

        if (bvhWhiteList.includes(this.name))
            modules.rc.create();

        ui.domInfoTool.innerHTML = `[ ${ this.name.replace('_', ' ').toUpperCase() } ]`;
    }
}


// -------------------------------------------------------
// Tool Bakery


class ToolBakery {
    constructor() {
        this.name = 'select';
        this.selected = [];
    }

    handleToolDown() {
        const pick = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
            return bakery.meshes.includes(mesh);
        });

        if (pick && pick.hit) {
            switch (this.name) {
                case 'select':
                    bakery.deselectMesh();
                    uix.bindTransformGizmo(pick.pickedMesh);
                    break;
                case 'merge':
                    const idx = this.selected.indexOf(pick.pickedMesh);
                    if (idx == -1) {
                        this.selected.push(pick.pickedMesh);
                        highlightOverlayMesh(pick.pickedMesh, COL_ORANGE_RGB);
                        highlightOutlineMesh(pick.pickedMesh, COL_ORANGE_RGB);
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

            bakery.mergeSelected(this.selected);

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
            if (i.classList.contains("tool_bakery_selector"))
                i.classList.remove("tool_bakery_selector");
        for (let i of document.querySelectorAll('button'))
            if (i.classList.contains("tool_bakery_selector"))
                i.classList.remove("tool_bakery_selector");
        for (let i = 0; i < elems.length; i++)
            elems[i].classList.add("tool_bakery_selector");

        bakery.deselectMesh();
        uix.unbindTransformGizmo();
    }
}


// -------------------------------------------------------
// Symmetry


class Symmetry {
    constructor() {
        this.axis = -1; // BABYLON.Axis.X
    }

    setAxis(axis) {
        this.axis = axis;
        helper.toggleAxisPlane(false);
        helper.setSymmPivot();

        if (axis == BABYLON.Axis.X) {
            helper.setAxisPlane(BABYLON.Axis.X, BABYLON.Vector3.Zero());
            ui.domSymmAxisS.style.color = '#98a1ac';
            ui.domSymmAxisX.style.color = COL_AXIS_X;
            ui.domSymmAxisY.style.color = '#98a1ac';
            ui.domSymmAxisZ.style.color = '#98a1ac';
            ui.domInScreenSymmAxis.innerHTML = 'X';
            ui.domInScreenSymmAxis.style.color = COL_AXIS_X;
        } else if (axis == BABYLON.Axis.Y) {
            helper.setAxisPlane(BABYLON.Axis.Y, BABYLON.Vector3.Zero());
            ui.domSymmAxisS.style.color = '#98a1ac';
            ui.domSymmAxisX.style.color = '#98a1ac';
            ui.domSymmAxisY.style.color = COL_AXIS_Y;
            ui.domSymmAxisZ.style.color = '#98a1ac';
            ui.domInScreenSymmAxis.innerHTML = 'Y';
            ui.domInScreenSymmAxis.style.color = COL_AXIS_Y;
        } else if (axis == BABYLON.Axis.Z) {
            helper.setAxisPlane(BABYLON.Axis.Z, BABYLON.Vector3.Zero());
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
            this.setAxis(BABYLON.Axis.X);
        } else if (this.axis == BABYLON.Axis.X) {
            this.setAxis(BABYLON.Axis.Y);
        } else if (this.axis == BABYLON.Axis.Y) {
            this.setAxis(BABYLON.Axis.Z);
        } else if (this.axis == BABYLON.Axis.Z) {
            this.resetAxis();
        }
    }

    switchAxisByNum(axis) {
        if (axis == -1) {
            this.resetAxis();
        } else if (axis == 0) {
            this.setAxis(BABYLON.Axis.X);
        } else if (axis == 1) {
            this.setAxis(BABYLON.Axis.Y);
        } else if (axis == 2) {
            this.setAxis(BABYLON.Axis.Z);
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
            if (this.axis == BABYLON.Axis.X) {
                if (side == -1 && this.center(p.x) <= -0.1) toDelete.push(builder.voxels[i]);
                if (side == 1  && this.center(p.x) >= 0.1)  toDelete.push(builder.voxels[i]);
            }
            else if (this.axis == BABYLON.Axis.Y) {
                if (side == -1 && this.center(p.y) <= -0.1) toDelete.push(builder.voxels[i]);
                if (side == 1  && this.center(p.y) >= 0.1)  toDelete.push(builder.voxels[i]);
            }
            else if (this.axis == BABYLON.Axis.Z) {
                if (side == -1 && this.center(p.z) <= -0.1) toDelete.push(builder.voxels[i]);
                if (side == 1  && this.center(p.z) >= 0.1)  toDelete.push(builder.voxels[i]);
            }
        }

        builder.removeArray(toDelete);
    }

    invertPos(p) { // invert positive to negative and reverse
        if (this.axis == BABYLON.Axis.X) p = new BABYLON.Vector3(this.center2(p.x), p.y, p.z);
        if (this.axis == BABYLON.Axis.Y) p = new BABYLON.Vector3(p.x, this.center2(p.y), p.z);
        if (this.axis == BABYLON.Axis.Z) p = new BABYLON.Vector3(p.x, p.y, this.center2(p.z));
        return p;
    }

    center(p) { // calculate position from center
        if (ui.domSymmCenter.checked) { // world center
            if (this.axis == BABYLON.Axis.X) return -0.5 - p;
            if (this.axis == BABYLON.Axis.Y) return -0.5 - p;
            if (this.axis == BABYLON.Axis.Z) return -0.5 - p;
        } else { // local center
            const center = builder.getCenter();
            if (this.axis == BABYLON.Axis.X) return center.x - p;
            if (this.axis == BABYLON.Axis.Y) return center.y - p;
            if (this.axis == BABYLON.Axis.Z) return center.z - p;
        }
    }

    center2(p) { // calculate position from center*2
        if (ui.domSymmCenter.checked) { // world center
            if (this.axis == BABYLON.Axis.X) return -1 - p;
            if (this.axis == BABYLON.Axis.Y) return -1 - p;
            if (this.axis == BABYLON.Axis.Z) return -1 - p;
        } else { // local center
            const center = builder.getCenter();
            if (this.axis == BABYLON.Axis.X) return (center.x * 2) - p;
            if (this.axis == BABYLON.Axis.Y) return (center.y * 2) - p;
            if (this.axis == BABYLON.Axis.Z) return (center.z * 2) - p;
        }
    }

    findIndexInvert(p) {
        return builder.getIndexAtPosition(this.invertPos(p));
    }
}


// -------------------------------------------------------
// Voxelizer


class Voxelizer {
    constructor() {}

    voxelizeMesh(mesh) {
        const scale = parseInt(ui.domVoxelizerScale.value);

        normalizeMesh(mesh, scale);

        const data = modules.rcv.mesh_voxel(mesh, scale, COL_ICE);
        builder.setDataFromArray(data);
        clearScene();
    }

    async voxelizeBake() {
        if (bakery.selected) {
            if (!await ui.showConfirm('clear and replace all voxels?')) return;
            ui.setMode(0);
            
            const data = modules.rcv.mesh_bake(bakery.selected);
            builder.setDataFromArray(data);
            builder.normalizeVoxelPositions();
            clearScene();
        } else {
            ui.notification('select a bake');
        }
    }

    voxelize2D(imgData) {
        displayLoading(true);
        const ratio = parseFloat(ui.domVoxelizerRatio.value);
        const yUp = ui.domVoxelizerYup.checked;

        const img = new Image();
        img.src = imgData;
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const c = document.createElement('canvas');
            const cx = c.getContext('2d');

            const dim = aspectRatioFit(img.width, img.height, 10*ratio, 10*ratio);
            c.width = dim.width;
            c.height = dim.height;

            cx.msImageSmoothingEnabled = false;
            cx.mozImageSmoothingEnabled = false;
            cx.webkitImageSmoothingEnabled = false;
            cx.imageSmoothingEnabled = false;
            cx.drawImage(img, 0, 0, c.width, c.height);

            const data = [];
            const imageData = cx.getImageData(0, 0, c.width, c.height).data;
            let x,y,r,g,b;
            for (let i = 0; i < imageData.length; i += 4) {
                if (imageData[i + 3] > 0) {
                    r = imageData[i];
                    g = imageData[i + 1];
                    b = imageData[i + 2];
                    x = (i / 4) % c.width;
                    y = ~~(i / 4 / c.width);
                    if (yUp) {
                        data.push({
                            position: new BABYLON.Vector3(x, dim.height-y-1, 0).floor(),
                            color: rgbIntToHex(r, g, b),
                            visible: true
                        });
                    } else {
                        data.push({
                            position: new BABYLON.Vector3(x, 0, y).floor(),
                            color: rgbIntToHex(r, g, b),
                            visible: true
                        });
                    }
                }
            }

            builder.setDataFromArray(data);
            builder.normalizeVoxelPositions();
            clearScene();
            displayLoading(false);
        }
    }

    importMeshOBJ(url) {
        displayLoading(true);
        BABYLON.SceneLoader.LoadAssetContainerAsync(url, "", scene, null, '.obj')
            .then((container) => {
                const mesh = BABYLON.Mesh.MergeMeshes(container.meshes, true, true);
                container.removeAllFromScene();
                this.voxelizeMesh(mesh);
                mesh.dispose();
                displayLoading(false);
            }).catch((err) => {
                displayLoading(false);
                ui.notification("unable to import/merge meshes");
                console.error(err.message);
            });
    }

    importMeshGLB(url) {
        displayLoading(true);
        BABYLON.SceneLoader.LoadAssetContainerAsync(url, "", scene, null, '.glb')
            .then((container) => {
                const meshes = [];
                for (let i = 0; i < container.meshes.length; i++) {
                    if (container.meshes[i].name !== '__root__')
                        meshes.push(container.meshes[i]);
                }
                if (meshes.length > 0) {
                    const mesh = BABYLON.Mesh.MergeMeshes(meshes, true, true);
                    this.voxelizeMesh(mesh);
                    mesh.dispose();
                } else {
                    ui.notification('unable to find meshes');
                }
                container.removeAllFromScene();
                displayLoading(false);
            }).catch((err) => {
                displayLoading(false);
                ui.notification("unable to import/merge meshes");
                console.error(err.message);
            });
    }

    loadFromUrl(url) {
        if (url == "") return;
        displayLoading(true);
        fetch(url).then(res => {
            if (res.status == 200) {
                if (url.toLowerCase().includes('.obj') || url.endsWith('.obj')) {
                    this.importMeshOBJ(url);
                } else if (url.toLowerCase().includes('.glb') || url.endsWith('.glb')) {
                    this.importMeshGLB(url);
                } else {
                    ui.notification("unsupported file format");
                    displayLoading(false);
                }
            } else {
                ui.notification("unable to read url");
                displayLoading(false);
            }
        }).catch(err => {
            ui.notification("unable to read url");
            displayLoading(false);
        });
    }

    loadFromUrlImage(url) {
        if (url == "") return;
        displayLoading(true);
        fetch(url).then(async res => {
            if (res.status == 200) {
                const data = await res.blob();
                if (data.type &&
                    (data.type == 'image/png'  ||
                     data.type == 'image/jpeg' ||
                     data.type == 'image/svg+xml')) {
                        this.voxelize2D(url);
                } else {
                    ui.notification("unsupported file format");
                    displayLoading(false);
                }
            } else {
                ui.notification("unable to read url");
                displayLoading(false);
            }
        }).catch(err => {
            ui.notification("unable to read url");
            displayLoading(false);
        });
    }

    pasteBase64Image() {
        navigator.clipboard.readText()
            .then(url => {
                if (url.startsWith('data:image/')) {
                    this.voxelize2D(url);
                } else {
                    ui.notification('invalid base64 image');
                }
            })
            .catch(err => {
                ui.notification('failed to read clipboard data');
            });
    }
}


// -------------------------------------------------------
// Generator


class Generator {
    constructor() {}

    newBox(size, color) {
        builder.voxels = [];
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    builder.add(new BABYLON.Vector3(x, y, z), color, true);
                }
            }
        }
    }

    newBoxPosition(ev, elem) {
        if (ev.key == 'Enter') {
            const str = elem.value.split(',');
            if (str.length == 3 && parseInt(str[0]) !== NaN && parseInt(str[1]) !== NaN && parseInt(str[2]) !== NaN) {
                builder.add(new BABYLON.Vector3(parseInt(str[0]), parseInt(str[1]), parseInt(str[2])), currentColor, true);
                builder.create();
                builder.update();
            } else {
                ui.notification("invalid coord (e.g. 20,20,20)");
            }
        }
    }

    async createBox(isPlane = false) {
        const isNewScene = document.getElementById('input-grid-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        
        const isFill = document.getElementById('input-grid-fill').checked;
        const X = parseInt(document.getElementById('input-grid-x').value);
        const Y = (isPlane) ? 1 : parseInt(document.getElementById('input-grid-y').value);
        const Z = parseInt(document.getElementById('input-grid-z').value);
        
        const data = [];
        if (isFill) {
            for (let x = 0; x < X; x++) {
                for (let y = 0; y < Y; y++) {
                    for (let z = 0; z < Z; z++) {
                        data.push({
                            position: new BABYLON.Vector3(x, y, z),
                            color: COL_ICE,
                            visible: true
                        });
                    }
                }
            }
        } else {
            for (let x = 0; x < X; x++) {
                for (let y = 0; y < Y; y++) {
                    for (let z = 0; z < Z; z++) {
                        if (x == 0 || y == 0 || z == 0 ||
                            x == X-1 || y == Y-1 || z == Z-1) {
                            data.push({
                                position: new BABYLON.Vector3(x, y, z),
                                color: COL_ICE,
                                visible: true
                            });
                        }
                    }
                }
            }
        }

        if (isNewScene) {
            builder.setDataFromArray(data);
            clearScene();
        } else {
            xformer.beginNewObject(data);
        }
    }

    async createIsometric() {
        const isNewScene = document.getElementById('input-grid-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        const X = parseInt(document.getElementById('input-grid-x').value);
        const Y = parseInt(document.getElementById('input-grid-y').value);
        const Z = parseInt(document.getElementById('input-grid-z').value);

        const data = [];
        for (let x = 0; x < X; x++) {
            for (let y = 0; y < Y; y++) {
                for (let z = 0; z < Z; z++) {
                    if (x == 0 || y == 0 || z == 0)
                        data.push({
                            position: new BABYLON.Vector3(x, y, z),
                            color: COL_ICE,
                            visible: true
                        });
                }
            }
        }

        if (isNewScene) {
            builder.setDataFromArray(data);
            clearScene();
        } else {
            xformer.beginNewObject(data);
        }
    }

    async createSphere() {
        const isNewScene = document.getElementById('input-sphere-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;

        const size = parseInt(document.getElementById('input-sphere-size').value);
        let inner = parseInt(document.getElementById('input-sphere-inner').value);
        if (inner >= size) {
            inner = size - 1;
            document.getElementById('input-sphere-inner').value = inner;
        }
        inner -= 1;

        const rrmax = size * size;
        const rrmin = inner * inner;
        const center = size - 1;
        const data = [];

        function isSurface(x, y, z) {
            const dx = 2*x - center;
            const dy = 2*y - center;
            const dz = 2*z - center;
            const rr = dx*dx + dy*dy + dz*dz;
            return (rrmin <= rr) && (rr <= rrmax);
        }

        for (let z = 0; z < size; z++) {
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    if (isSurface(x, y, z)) {
                        data.push({
                            position: new BABYLON.Vector3(x, y, z),
                            color: COL_ICE,
                            visible: true
                        });
                    }
                }
            }
        }
        
        if (isNewScene) {
            builder.setDataFromArray(data);
            clearScene();
        } else {
            xformer.beginNewObject(data);
        }
    }

    async createTerrain() {
        const isNewScene = document.getElementById('input-terrain-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        const isHeightGrad = document.getElementById('input-terrain-grad').checked;
        const X = parseInt(document.getElementById('input-terrain-x').value);
        const Y = parseInt(document.getElementById('input-terrain-y').value);
        const Z = parseInt(document.getElementById('input-terrain-z').value);

        const simplex = new modules.SimplexNoise();
        const colArrayHigh = gradientHexArray('#87BC24', '#31A531', Y);
        const colArrayLow  = gradientHexArray('#217EC4', '#31A531', Y);

        const data = [];
        const scaleFactor = 0.17;
        let xoff = 0;
        let zoff = 0;
        let h = 0;
        for (let x = 0; x < X; x++) {
            for (let z = 0; z < Z; z++) {
                xoff = scaleFactor * x / Y;
                zoff = scaleFactor * z / Y;
                h = ~~(simplex.noise3d(xoff, 0, zoff) * Y);
                if (h >= 0) {
                    data.push({
                        position: new BABYLON.Vector3(x, h, z),
                        color: (isHeightGrad) ? colArrayHigh[h] : COL_ICE,
                        visible: true
                    });
                } else {
                    data.push({
                        position: new BABYLON.Vector3(x, h, z),
                        color: (isHeightGrad) ? colArrayLow[ Math.abs(h) ] : COL_ICE,
                        visible: true
                    });
                }
            }
        }

        if (isNewScene) {
            builder.setDataFromArray(data);
            clearScene();
        } else {
            xformer.beginNewObject(data, (isHeightGrad) ? true : false);
        }
    }
}


// -------------------------------------------------------
// Bakery


class Bakery {
    constructor() {
        this.meshes = [];
        this.selected = null;
        this.lastSelected = null;
        this.pick = null;
    }

    exportOptions = {
        shouldExportNode: (node) => {
            return this.meshes.includes(node);
        }
    };

    exportOptionsSelected = {
        shouldExportNode: (node) => {
            if (ui.domExportSelectedBake.checked && this.selected)
                return this.selected === node;
            return false;
        }
    };
    
    bakeToMesh(voxels = builder.voxels) {
        const baked = modules.bakery.bake('_mesh', voxels);

        resetPivot(baked);

        baked.material = material.mat_pbr.clone('_mesh');

        baked.checkCollisions = true;
        baked.receiveShadows = true;

        light.addMesh(baked);
        light.updateShadowMap();

        this.meshes.push(baked);
        this.createBakeryList();
    }

    newBake(voxels = null) {
        displayLoading(true);
        ui.setMode(2);

        material.setPBRTexture();

        (voxels) ? this.bakeToMesh(voxels) : this.bakeToMesh();

        uix.bindTransformGizmo(this.meshes[this.meshes.length-1]);
        uix.gizmo.attachToMesh(this.meshes[this.meshes.length-1]);

        camera.frame();
        displayLoading(false);
    }

    bakeColor(hex) {
        displayLoading(true);
        ui.setMode(2);

        material.setPBRTexture();

        const voxels = [];
        for (let i = 0; i < builder.voxels.length; i++) {
            if (builder.voxels[i].color == hex)
                voxels.push(builder.voxels[i]);
        }
        this.bakeToMesh(voxels);

        uix.bindTransformGizmo(this.meshes[this.meshes.length-1]);
        uix.gizmo.attachToMesh(this.meshes[this.meshes.length-1]);

        camera.frame();
        displayLoading(false);
    }

    bakeColor(hex) {
        displayLoading(true);
        ui.setMode(2);

        material.setPBRTexture();

        const voxels = [];
        for (let i = 0; i < builder.voxels.length; i++) {
            if (builder.voxels[i].color == hex)
                voxels.push(builder.voxels[i]);
        }
        this.bakeToMesh(voxels);

        setTimeout(() => {
            uix.bindTransformGizmo(this.meshes[this.meshes.length-1]);
            uix.gizmo.attachToMesh(this.meshes[this.meshes.length-1]);
            camera.frame();
            displayLoading(false);
        }, 100);
    }

    async bakeAll() {
        if (!await ui.showConfirm('clear and bake all voxels?')) return;
        displayLoading(true);
        ui.setMode(2);

        material.setPBRTexture();

        this.clearBakes();
        this.bakeToMesh();

        camera.frame();
        displayLoading(false);
    }

    async bakeAllColors() {
        if (!await ui.showConfirm('clear and bake all voxels<br>grouped by colors?')) return;
        displayLoading(true);
        ui.setMode(2);

        material.setPBRTexture();

        this.clearBakes();
        for (let i = 0; i < palette.uniqueColors.length; i++)
            this.bakeToMesh(builder.getVoxelsByColor(palette.uniqueColors[i]));

        camera.frame();
        displayLoading(false);
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
            highlightOverlayMesh(clone, COL_ORANGE_RGB);

            this.meshes.push(clone);
            this.createBakeryList();
            this.bakeListSelect(clone);
        } else {
            ui.notification('select a mesh');
        }
    }

    async mergeAll() {
        if (this.meshes.length > 0) {
            if (!await ui.showConfirm('merge all baked meshes?')) return;

            const mesh = BABYLON.Mesh.MergeMeshes(this.meshes, true, true);
            resetPivot(mesh);
            mesh.name = '_merged';

            this.clearMeshArray();

            material.setPBRTexture();
            mesh.material = material.mat_pbr.clone('_merged');

            mesh.checkCollisions = true;
            mesh.receiveShadows = true;
            light.addMesh(mesh);
            light.updateShadowMap();

            uix.bindTransformGizmo(mesh);
            uix.gizmo.attachToMesh(mesh);
            
            this.meshes.push(mesh);
            this.createBakeryList();
        }
    }

    mergeSelected(bakes) {
        const mesh = BABYLON.Mesh.MergeMeshes(bakes, true, true);
        resetPivot(mesh);
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
        mesh.material = material.mat_pbr.clone('_merged');

        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        light.addMesh(mesh);
        light.updateShadowMap();

        uix.bindTransformGizmo(mesh);
        uix.gizmo.attachToMesh(mesh);
        
        this.meshes.push(mesh);
        this.createBakeryList();
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
            this.createBakeryList();
            uix.unbindTransformGizmo();
            light.updateShadowMap();
        } else {
            ui.notification('select a mesh');
        }
    }

    selectMesh(mesh) {
        this.selected = mesh;
        this.lastSelected = mesh;
        highlightOutlineMesh(mesh, COL_ORANGE_RGBA);
        this.bakeListSelect(mesh);
    }

    deselectMesh() {
        this.selected = null;
        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].renderOverlay = false;
            this.meshes[i].renderOutline = false;
        }
        this.bakeListDeselect();
    }

    onGizmoAttached(mesh) {
        this.deselectMesh(); // on user select
        this.selectMesh(mesh);
        this.getMaterial();
    }

    setBakesVisibility(isVisible) {
        for (let i = 0; i < this.meshes.length; i++)
            this.meshes[i].isVisible = isVisible;
    }

    resetRotation() {
        if (this.selected) {
            this.selected.rotation = BABYLON.Vector3.Zero();
            light.updateShadowMap();
        } else {
            ui.notification('select a mesh');
        }
    }

    async clearBakes(isAlert = false) {
        if (this.meshes.length > 0) {
            if (isAlert && !await ui.showConfirm('clear all baked meshes?')) return;
            this.clearMeshArray();
            this.selected = null;
            this.createBakeryList();
            uix.unbindTransformGizmo();
            light.updateShadowMap();
        }
    }
    
    getMaterial() {
        if (this.selected) {
            currentColorBake = this.selected.material.albedoColor.toHexString();
            ui.domRoughness.value = this.selected.material.roughness;
            ui.domRoughnessRange.value = this.selected.material.roughness;
            ui.domMetallic.value = this.selected.material.metallic;
            ui.domMetallicRange.value = this.selected.material.metallic;
            ui.domAlpha.value = this.selected.material.alpha;
            ui.domAlphaRange.value = this.selected.material.alpha;
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
                    this.selected.material.albedoColor = BABYLON.Color3.FromHexString(currentColorBake);
                    break;
                case 'emissive':
                    this.selected.material.emissiveColor = BABYLON.Color3.FromHexString(ui.domColorPickerEmissive.value);
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
            const rgb = BABYLON.Color3.FromHexString(hex).toLinearSpace();
            const positions = this.selected.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            for (let i = 0; i < positions.length/3; i++) {
                colors.push(rgb.r, rgb.g, rgb.b, 1);
            }
            this.selected.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
        } else {
            ui.notification('select a mesh');
        }
    }

    createBakeryList() {
        ui.domBakeryList.innerHTML = "";
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
            ui.domBakeryList.appendChild(item);
        }
    }

    bakeListSelect(mesh) {
        let idx = -1;
        for (let i = 0; i < this.meshes.length; i++)
            if (this.meshes[i] === mesh)
                idx = i;
        
        if (ui.domBakeryList.children[idx]) {
            for (const i of ui.domBakeryList.children)
                i.firstChild.classList.remove("bakery_select");
            ui.domBakeryList.children[idx].firstChild.classList.add('bakery_select');
        }
    }

    bakeListDeselect() {
        for (const i of ui.domBakeryList.children)
            i.firstChild.classList.remove("bakery_select");
    }

    loadBakes(url, isLoadBakery, isInsideBakery = false) {
        displayLoading(true);
        BABYLON.SceneLoader.LoadAssetContainerAsync("", url, scene, null, '.glb')
            .then((container) => {
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
                    ui.notification('unable to load baked meshes');
                } else {
                    if (!isInsideBakery) {
                        if (isLoadBakery) {
                            ui.setMode(2);
                        } else {
                            ui.setMode(0);
                            this.setBakesVisibility(false);
                        }
                    }
                    this.updateReflectionTextures();
                    this.createBakeryList();
                    light.updateShadowMap();
                }
                displayLoading(false);
            }).catch(err => {
                displayLoading(false);
                ui.notification("unable to load bake");
                console.error(err.message);
            });
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
}


// -------------------------------------------------------
// Snapshot


const strVox = 'vbstore_voxels';
const strVoxSnap = 'vbstore_voxels_snap';
const strVoxSnapImage = 'vbstore_voxels_snap_img';
const strBakes = 'vbstore_bakes';

class Snapshot {
    constructor() {
        this.createSnapshots();
    }

    setStorageVoxels(name = strVox) {
        localStorage.setItem(name, builder.getData());
    }

    getStorageVoxels(name = strVox) {
        const data = localStorage.getItem(name);
        if (!data) {
            ui.notification("empty storage");
            return;
        }
        builder.setData(data);
        clearScene(true);
    }

    setStorageBakes() {
        if (bakery.meshes.length > 0) {
            BABYLON.GLTF2Export.GLBAsync(scene, strBakes, bakery.exportOptions).then((glb) => {
                const blob = glb.glTFFiles[strBakes + ".glb"];
                const file = new File([ blob ], "storage.glb");
                const reader = new FileReader();
                reader.onload = () => {
                    localStorage.setItem(strBakes, reader.result);
                }
                reader.readAsDataURL(file);
            });
        } else {
            localStorage.setItem(strBakes, 0);
        }
    }
    
    getStorageBakes() {
        const data = localStorage.getItem(strBakes);
        if (!data) {
            ui.notification("empty storage");
            return;
        }
        if (data !== '0') {
            ui.setMode(2);
            bakery.clearBakes(false);
            bakery.loadBakes(data, false, true);
        }
    }

    delStorage(name) {
        if (localStorage.getItem(name))
            localStorage.removeItem(name);
    }

    createSnapshots() {
        const shots = document.querySelectorAll('li.storage');
        for (let i = 0; i < shots.length; i++) {
            const img = shots[i].children[0];
            const save = shots[i].children[1].lastChild;
            const clear = shots[i].children[1].firstChild;

            img.src = SNAPSHOT;
            img.id = 'shot' + i;

            // restore previous on startup
            const data = localStorage.getItem(strVoxSnapImage + img.id);
            if (data) img.src = data;

            clear.addEventListener("click", async () => {
                if (MODE !== 0 || img.src !== SNAPSHOT && !await ui.showConfirm('delete snapshot?')) return;
                img.src = SNAPSHOT;
                this.delStorage(strVoxSnap + img.id);
                this.delStorage(strVoxSnapImage + img.id);
            }, false);

            save.addEventListener("click", async () => {
                if (MODE !== 0 || img.src !== SNAPSHOT && !await ui.showConfirm('save new snapshot?')) return;
                createScreenshotBasic(img.clientWidth, img.clientHeight, (data) => {
                    img.src = data;
                    this.setStorageVoxels(strVoxSnap + img.id);
                    localStorage.setItem(strVoxSnapImage + img.id, data);
                });
            }, false);

            img.addEventListener("click", async () => {
                if (MODE !== 0 || img.src !== SNAPSHOT && !await ui.showConfirm('load snapshot?')) return;
                this.getStorageVoxels(strVoxSnap + img.id);
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
            version: "Voxel Builder 4.3.9",
            project: {
                name: "name",
                voxels: builder.voxels.length,
                meshes: bakery.meshes.length
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

    async newProject() {
        if (!await ui.showConfirm('create new project?')) return;
        generator.newBox(1, COL_ICE);
        builder.create();
        clearSceneAndReset();
        ui.domProjectName.value = 'untitled';
    }

    newProjectStartup(size = 20) {
        builder.voxels = [];
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    builder.add(new BABYLON.Vector3(x, y, z), COL_ICE, true);
                }
            }
        }
        builder.create();
        clearSceneAndReset();
        ui.domProjectName.value = 'untitled';
    }

    save() {
        const json = this.serializeScene(builder.getDataString(), "");

        if (bakery.meshes.length > 0) {
            BABYLON.GLTF2Export.GLBAsync(scene, ui.domProjectName.value, bakery.exportOptions).then((glb) => {
                const blob = glb.glTFFiles[ui.domProjectName.value + ".glb"];
                const file = new File([ blob ], "exported.glb");
                const reader = new FileReader();
                reader.onload = () => {
                    json.data.meshes = reader.result;
                    downloadJson(JSON.stringify(json, null, 4), ui.domProjectName.value + '.json');
                }
                reader.readAsDataURL(file);
            });
        } else {
            downloadJson(JSON.stringify(json, null, 4), ui.domProjectName.value + '.json');
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
        clearSceneAndReset();

        // data.meshes
        if (data.data.meshes) {
            bakery.clearBakes(false);
            bakery.loadBakes(data.data.meshes, false);
        } else if (data.data.bakes) { // backward compatibity
            bakery.clearBakes(false);
            bakery.loadBakes(data.data.bakes, false);
        } else {
            bakery.clearBakes(false);
        }
    }

    importVoxels(data) {
        ui.setMode(0);
        
        const voxels = JSON.parse(data).data.voxels.split(';').slice(0, -1);
        for (let i = 0; i < voxels.length; i++) {
            const chunk = voxels[i].split(',');
            builder.add(new BABYLON.Vector3(
                    parseFloat(chunk[0]),
                    parseFloat(chunk[1]),
                    parseFloat(chunk[2])
                ),
                chunk[3].toUpperCase(),
                parseBool(chunk[4]));
        }
        
        builder.create();
        builder.update();
        clearScene();
    }

    importBakes(data) {
        data = JSON.parse(data);
        if (data.data.meshes) {
            bakery.loadBakes(data.data.meshes, true);
        } else {
            ui.notification('no baked meshes');
        }
    }

    exportVoxels() {
        displayLoading(true);

        const mesh = builder.createMesh();

        const options = {
            shouldExportNode: (node) => {
                return node === mesh;
            }
        }

        switch (ui.domExportFormat.value) {
            case 'glb':
                BABYLON.GLTF2Export.GLBAsync(scene, ui.domProjectName.value, options).then((glb) => {
                    glb.downloadFiles();
                    mesh.dispose();
                    displayLoading(false);
                });
                break;
            case 'gltf':
                BABYLON.GLTF2Export.GLTFAsync(scene, ui.domProjectName.value, options).then((gltf) => {
                    gltf.downloadFiles();
                    mesh.dispose();
                    displayLoading(false);
                });
                break;
            case 'obj':
                downloadBlob(new Blob([ 
                    BABYLON.OBJExport.OBJ([ mesh ], false, 'material', true)
                ], { type: "octet/stream" }), ui.domProjectName.value + '.obj');
                mesh.dispose();
                displayLoading(false);
                break;
            case 'stl':
                BABYLON.STLExport.CreateSTL([ mesh ], true, ui.domProjectName.value, false, false, false);
                mesh.dispose();
                displayLoading(false);
                break;
        }
    }

    exportBakes() {
        if (bakery.meshes.length == 0) {
            ui.notification('no baked meshes');
            return;
        }
        if (ui.domExportSelectedBake.checked && !bakery.selected) {
            ui.notification('select a mesh');
            return;
        }
        displayLoading(true);

        let exports = bakery.exportOptions;
        if (ui.domExportSelectedBake.checked && bakery.selected)
            exports = bakery.exportOptionsSelected;

        if (ui.domExportFormat.value == 'obj' || ui.domExportFormat.value == 'stl') {
            if (ui.domExportSelectedBake.checked && bakery.selected) {
                exports = [ bakery.selected ];
            } else {
                exports = bakery.meshes;
            }
        }

        switch (ui.domExportFormat.value) {
            case 'glb':
                BABYLON.GLTF2Export.GLBAsync(scene, ui.domProjectName.value, exports).then((glb) => {
                    glb.downloadFiles();
                    displayLoading(false);
                });
                break;
            case 'gltf':
                BABYLON.GLTF2Export.GLTFAsync(scene, ui.domProjectName.value, exports).then((gltf) => {
                    gltf.downloadFiles();
                    displayLoading(false);
                });
                break;
            case 'obj':
                downloadBlob(new Blob([
                    BABYLON.OBJExport.OBJ(exports, false, 'material', true)
                ], { type: "octet/stream" }), ui.domProjectName.value + '.obj');
                break;
            case 'stl':
                BABYLON.STLExport.CreateSTL(exports, true, ui.domProjectName.value, false, false, false);
                break;
        }
        displayLoading(false);
    }

    loadFromUrl(url, callback = undefined) {
        if (url == '') return; // ignore first preset option
        loadUrl(url, (data) => {
            this.load(data);
            if (callback) callback();
        });
    }

    async loadMagicaVoxel(buffer) {
        displayLoading(true);
        const msg = await modules.workerPool.postMessage({ id: 'parseMagicaVoxel', data: buffer });
        if (msg) {
            const voxels = [];
            for (let i = 0; i < msg.data.length; i++) {
                voxels.push({ 
                    position: new BABYLON.Vector3(msg.data[i].x, msg.data[i].y, msg.data[i].z),
                    color: msg.data[i].color,
                    visible: true
                });
            }
            builder.setDataFromArray(voxels, true);
            builder.normalizeVoxelPositions(false);
            clearSceneAndReset();
            ui.domProjectName.value = 'untitled';
            displayLoading(false);
        } else {
            ui.notification('incompatible vox file');
            displayLoading(false);
        }
    }

    setProjectValues(uiDom, iniKey, defVal) {
        (iniKey) ? uiDom.value = iniKey : uiDom.value = defVal;
    }
}


// -------------------------------------------------------
// Preferences


const KEY_STARTUP = "pref_startup";
const KEY_NOHOVER = "pref_nohover";
const KEY_PALETTE_SIZE = "pref_palette_size";
const KEY_FLOORPLANE = "pref_floorplane";
const KEY_POINTCLOUD = "pref_pointcloud";
const KEY_POWERSAVER = "pref_powersaver";
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
        document.getElementById(KEY_POWERSAVER).checked = isMobile;
        document.getElementById(KEY_WEBSOCKET).checked = false;
        document.getElementById(KEY_WEBSOCKET_URL).value = "localhost:8014";

        this.initPrefCheck(KEY_STARTUP);
        this.initPrefCheck(KEY_NOHOVER);
        this.initPref(KEY_PALETTE_SIZE);
        this.initPrefCheck(KEY_FLOORPLANE, (chk) => {
            if (MODE == 0 || MODE == 2) helper.floorPlane.isVisible = chk;
        });
        this.initPrefCheck(KEY_POINTCLOUD, (chk) => {
            (chk && MODE == 2) ? ghosts.createPointCloud() : ghosts.disposePointCloud();
        });
        this.initPrefCheck(KEY_POWERSAVER, (chk) => {
            if (chk) {
                FPS = 1000 / 30;
                ui.domRenderBounces.value = 3;
            } else {
                FPS = 1000 / 60;
                ui.domRenderBounces.value = 4;
            }
            if (modules.pt.isActive && modules.pt.isLoaded)
                modules.pt.updateUniformBounces(ui.domRenderBounces.value);
        });
        this.initPrefCheck(KEY_WEBSOCKET, (chk) => {
            (chk && MODE == 0) ? modules.ws_client.connect() : modules.ws_client.disconnect();
        });
        this.initPref(KEY_WEBSOCKET_URL);
    }

    finish() {
        console.log('load preferences');

        if (this.getPowerSaver()) {
            FPS = 1000 / 30;
            ui.domRenderBounces.value = 3;
        } else {
            FPS = 1000 / 60;
            ui.domRenderBounces.value = 4;
        }
        palette.expand(this.getPaletteSize());
        ui.toggleHover(!this.getNoHover());
        helper.floorPlane.isVisible = this.getFloorPlane();

        const interval = setInterval(() => {
            if (modules.ws_client) {
                if (this.getStartup()) {
                    project.loadFromUrl('user/startup.json', () => {
                        ui.hideInterface(false);
                        displayLoading(false);
                        clearInterval(interval);
                        console.log(`startup: ${(performance.now()-startTime).toFixed(2)} ms`);
                        this.postFinish();
                    });
                } else {
                    project.newProjectStartup();
                    ui.hideInterface(false);
                    displayLoading(false);
                    clearInterval(interval);
                    console.log(`startup: ${(performance.now()-startTime).toFixed(2)} ms`);
                    this.postFinish();
                }
            }
        }, 100);
    }

    postFinish() {
        setTimeout(() => {
            hdri.preload();
            
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
        }, 1000); // no less, major ratio to fix the hdri lag
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

    setPowerSaver(isEnabled) {
        localStorage.setItem(KEY_POWERSAVER, isEnabled);
    }

    getPowerSaver() {
        return document.getElementById(KEY_POWERSAVER).checked;
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
// UserInterface


class UserInterface {
    constructor() {
        this.domToolbarR = document.getElementById('toolbar_R');
        this.domToolbarL = document.getElementById('toolbar_L');
        this.domToolbarC = document.getElementById('toolbar_C');
        this.domToolbarC_mem = document.getElementById('toolbar_C_mem');
        this.domModes = document.querySelectorAll('#toolbar_C li.mode');
        this.domMenus = document.getElementById('menus');
        this.domMenuInScreenRight = document.getElementById('menu-inscreen-right');
        this.domMenuInScreenLeft = document.getElementById('menu-inscreen-left');
        this.domMenuInScreenBottom = document.getElementById('menu-inscreen-bottom');
        this.domInScreenSymmAxis = document.getElementById('btn-inscreen-symmetry');
        this.domInScreenOrtho = document.getElementById('btn-inscreen-ortho');
        this.domInScreenGridPlane = document.getElementById('btn-inscreen-gridplane');
        this.domInScreenWorkplane = document.getElementById('btn-inscreen-workplane');
        this.domInScreenLightLocator = document.getElementById('btn-inscreen-lightlocator');
        this.domSymmAxisS = document.getElementById('btn-symm-axis-s');
        this.domSymmAxisX = document.getElementById('btn-symm-axis-x');
        this.domSymmAxisY = document.getElementById('btn-symm-axis-y');
        this.domSymmAxisZ = document.getElementById('btn-symm-axis-z');
        this.domSymmCenter = document.getElementById('input-symm-center');
        this.domPalette = document.getElementById('palette');
        this.domPaletteColors = document.getElementById('palette-colors');
        this.domBakeryList = document.getElementById('bakerylist');
        this.domHover = document.getElementById('hover');
        this.domMarquee = document.getElementById("marquee");
        this.domBoxToolHeight = document.getElementById('input-boxtool-height');
        this.domHdriToggle = document.getElementById('input-hdri-toggle');
        this.domHdriBlur = document.getElementById('input-hdri-blur');
        this.domCameraFov = document.getElementById('input-camera-fov');
        this.domCameraAperture = document.getElementById('input-camera-aperture');
        this.domCameraFocalLength = document.getElementById('input-camera-focal');
        this.domRenderBtn = document.getElementById('tab-render');
        this.domTransformClone = document.getElementById('input-transform-clone');
        this.domVoxelizerScale = document.getElementById('input-voxelizer-scale');
        this.domVoxelizerRatio = document.getElementById('input-voxelizer-ratio');
        this.domVoxelizerYup = document.getElementById('input-voxelizer-yup');
        this.domToolBakeColor = document.getElementsByClassName('tool_bake_color')[0];
        this.domBakeryBackFace = document.getElementById('input-bakery-backface');
        this.domAutoRotation = document.getElementById('input-autorotate');
        this.domAutoRotationCCW = document.getElementById('input-autorotate-ccw');
        this.domTexturePresets = document.getElementById('texturepresets');
        this.domTextureAdd = document.getElementById('add_texture');
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
        this.domMaterialSwitch = document.getElementById('material-switch');
        this.domProjectName = document.getElementById('input-project-name');
        this.domExportFormat = document.getElementById('input-export-format');
        this.domExportSelectedBake = document.getElementById('input-export-selbake');
        this.domOrthoBtn = document.getElementById('btn-ortho');
        this.domPathtracer = document.getElementById('pathtracer');
        this.domRenderSource = document.getElementById('input-pt-source');
        this.domRenderShade = document.getElementById('input-pt-shade');
        this.domRenderPause = document.getElementById('btn-pt-pause');
        this.domRenderShot = document.getElementById('btn-pt-shot');
        this.domRenderFast = document.getElementById('btn-pt-fast');
        this.domRenderMaxSamples = document.getElementById('input-pt-maxsamples');
        this.domRenderPasses = document.getElementById('input-pt-passes');
        this.domRenderBounces = document.getElementById('input-pt-bounces');
        this.domRenderEnvPower = document.getElementById('input-pt-envpower');
        this.domRenderDirectLight = document.getElementById('input-pt-directlight');
        this.domRenderBackground = document.getElementById('input-pt-background');
        this.domRenderMaterial = document.getElementById('input-pt-material');
        this.domRenderEmissive = document.getElementById('input-pt-emissive');
        this.domRenderRoughness = document.getElementById('input-pt-roughness');
        this.domRenderFloor = document.getElementById('input-pt-floor');
        this.domRenderFloorColor = document.getElementById('input-pt-floorcolor');
        this.domRenderGrid = document.getElementById('input-pt-grid');
        this.domConfirm = document.getElementById('confirm');
        this.domConfirmBlocker = document.getElementById('confirmblocker');
        this.domNotifier = document.getElementById('notifier');
        this.domInfo = document.getElementById('info').children;
        this.domInfoParent = document.getElementById('info');
        this.domInfoTool = document.getElementById('info_tool');
        this.domInfoRender = document.getElementById('info_render');
        this.domProgressBar = document.getElementById('progressbar');
        this.domWebSocketStatus = document.getElementById('ws_status');
        this.panels = [];
        this.lastIndex = 1000;
        this.notificationTimer = null;

        this.eyeDropper = undefined;
        if (window.EyeDropper) {
            this.eyeDropper = new EyeDropper();
            document.getElementById('activate_pixeleyedrop').disabled = false;
        }
        this.abortController = new AbortController();

        this.registerPanels();
        this.registerToolbarButtons();
    }

    setMode(mode) {
        if (preferences.isInitialized && MODE == mode) return;
        MODE = mode;

        scene.autoClear = this.domBackgroundCheck.checked;
        scene.clearColor = BABYLON.Color4.FromHexString(this.domColorPickerBackground.value);
        hdri.showSkybox(this.domHdriToggle.checked);

        if (scene.activeCamera.useAutoRotationBehavior)
            camera.toggleCameraAutoRotation();
        camera.switchCamera();

        if (modules.pt)
            modules.pt.deactivate();

        if (mode == 0) {
            builder.setMeshVisibility(true);
            bakery.setBakesVisibility(false);
            helper.displayGridPlane(helper.isFloorPlaneActive, true);
            helper.displayWorkplane(helper.isWorkplaneActive);
            helper.toggleAxisPlane(symmetry.axis !== -1);
            light.updateShadowMap();
            uix.setLightLocator(uix.isSunLocatorActive);
            uix.unbindTransformGizmo();
            ghosts.disposePointCloud();
        } else if (mode == 1) {
            if (!hdri.isLoaded)
                hdri.loadHDR(ENVMAP);
        } else if (mode == 2) {
            builder.setMeshVisibility(false);
            bakery.setBakesVisibility(true);
            bakery.createBakeryList();
            toolBakery.toolSelector('select');
            helper.displayGridPlane(helper.isFloorPlaneActive, true);
            helper.displayWorkplane(helper.isWorkplaneActive);
            helper.toggleAxisPlane(false);
            helper.clearOverlays();
            light.updateShadowMap();
            uix.setLightLocator(uix.isSunLocatorActive);
            if (preferences.getPointCloud())
                ghosts.createPointCloud();
            if (bakery.meshes.length == 0)
                camera.frame();
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
        this.domBakeryList.style.display = 'none';
        this.domHover.style.display = 'unset';
        this.domMenuInScreenLeft.style.display = 'none';
        this.domMenuInScreenRight.style.display = 'none';
        this.domInfoTool.style.display = 'none';
        this.domTextureAdd.disabled = false;
        uix.colorPicker.isVisible = false;
        for (const i of this.domToolbarL.children)
            i.style.display = 'unset';
        for (const i of this.domToolbarR.children)
            i.style.display = 'unset';
            
        if (mode == 0) {
            this.domPalette.style.display = 'unset';
            this.domToolbarR.children[9].style.display = 'none'; // MESHES
            this.domToolbarL.children[4].style.display = 'none'; // MATERIAL
            this.domToolbarL.children[5].style.display = 'none'; // TEXTURE
            this.domMenuInScreenLeft.style.display = 'flex';
            this.domMenuInScreenRight.style.display = 'flex';
            this.domInfoTool.style.display = 'unset';
            this.domTextureAdd.disabled = true;
            uix.colorPicker.isVisible = true;
        } else if (mode == 1) {
            this.domHover.style.display = 'none';
            this.domToolbarR.children[1].style.display = 'none'; // FILE
            this.domToolbarR.children[2].style.display = 'none'; // GENERATOR
            this.domToolbarR.children[3].style.display = 'none'; // IMPORT
            this.domToolbarR.children[4].style.display = 'none'; // SYMMETRY
            this.domToolbarR.children[5].style.display = 'none'; // MODEL
            this.domToolbarR.children[6].style.display = 'none'; // PAINT
            this.domToolbarR.children[7].style.display = 'none'; // VOXELS
            this.domToolbarR.children[8].style.display = 'none'; // BAKERY
            this.domToolbarR.children[9].style.display = 'none'; // MESHES
            this.domToolbarL.children[4].style.display = 'none'; // MATERIAL
            this.domToolbarL.children[5].style.display = 'none'; // TEXTURE
            this.domToolbarL.children[6].style.display = 'none'; // STORAGE
            this.domToolbarL.children[7].style.display = 'none'; // GROUP
            xformer.apply();
            modules.pt.toggle();
        } else if (mode == 2) {
            this.domBakeryList.style.display = 'unset';
            this.domHover.style.display = 'none';
            this.domToolbarR.children[2].style.display = 'none'; // GENERATOR
            this.domToolbarR.children[3].style.display = 'none'; // IMPORT
            this.domToolbarR.children[4].style.display = 'none'; // SYMMETRY
            this.domToolbarR.children[5].style.display = 'none'; // MODEL
            this.domToolbarR.children[6].style.display = 'none'; // PAINT
            this.domToolbarR.children[7].style.display = 'none'; // VOXELS
            this.domToolbarL.children[6].style.display = 'none'; // STORAGE
            this.domToolbarL.children[7].style.display = 'none'; // GROUP
        }

        this.setToolbarMem(mode);

        for (const i of this.domModes)
            i.classList.remove("mode_select");
        this.domModes[mode].classList.add("mode_select");

        if (scene.activeCamera.mode == BABYLON.Camera.PERSPECTIVE_CAMERA) {
            this.domOrthoBtn.innerHTML = 'Perspective';
            this.domInScreenOrtho.innerHTML = 'P';
        } else {
            this.domOrthoBtn.innerHTML = 'Orthographic';
            this.domInScreenOrtho.innerHTML = 'O';
        }
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
            this.domToolbarC_mem.children[0].onclick = () => { modules.pt.fastMode() };
            this.domToolbarC_mem.children[1].onclick = () => { this.domRenderShade.checked = !this.domRenderShade.checked; modules.pt.updateAttributeColors() };
            this.domToolbarC_mem.children[3].onclick = () => { modules.pt.pause() };
            this.domToolbarC_mem.children[4].onclick = () => { modules.pt.shot() };
            this.domToolbarC_mem.children[0].innerHTML = 'FAST';
            this.domToolbarC_mem.children[1].innerHTML = 'SHADE';
            this.domToolbarC_mem.children[3].innerHTML = 'PAUSE';
            this.domToolbarC_mem.children[4].innerHTML = 'SHOT';
        } else if (mode == 2) {
            this.domToolbarC_mem.children[0].onclick = () => { snapshot.setStorageBakes() };
            this.domToolbarC_mem.children[1].onclick = () => { snapshot.getStorageBakes() };
            this.domToolbarC_mem.children[3].onclick = () => { bakery.bakeAllColors() };
            this.domToolbarC_mem.children[4].onclick = () => { project.exportBakes() };
            this.domToolbarC_mem.children[0].innerHTML = 'SAVE';
            this.domToolbarC_mem.children[1].innerHTML = 'LOAD';
            this.domToolbarC_mem.children[3].innerHTML = 'BAKE';
            this.domToolbarC_mem.children[4].innerHTML = 'GET';
        }
    }

    registerToolbarButtons() {
        // find and match a toolbar button for a panel by id
        const toolbarButtons = document.querySelectorAll("button[id^='toolbar_btn_']");
        for (let i = 0; i < this.panels.length; i++) {
            for (let b = 0; b < toolbarButtons.length; b++) {
                if (toolbarButtons[b].id.split('_')[2] === this.panels[i].elem.id.split('-')[1]) {
                    toolbarButtons[b].onclick = () => { this.switchPanel(this.panels[i], toolbarButtons[b]) };
                    this.panels[i].button = toolbarButtons[b];
                }
            }
        }
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
        if (elem !== this.domHover) {
            const li = document.createElement('li');
            li.classList.add('row_panel');
    
            const div_move = document.createElement('div');
            const div_hide = document.createElement('div');
            const div_reset = document.createElement('div');
            div_move.innerHTML = '<i class="material-icons">open_with</i>';
            div_hide.innerHTML = '<i class="material-icons">remove_red_eye</i>';
            div_reset.innerHTML = '<i class="material-icons">exit_to_app</i>';
            div_move.onpointerdown = (ev) => {
                elem.style.borderRadius = '6px';
                elem.style.borderTop = 'solid 1px steelblue';
                elem.style.zIndex = this.lastIndex + 1;
                this.dragElement(idx, ev.target, elem);
                this.lastIndex += 1;
            };
            div_hide.onpointerdown = () => { this.switchPanel(this.panels[idx]) };
            div_reset.onpointerdown = () => { this.resetPanel(idx) };
            li.appendChild(div_move);
            li.appendChild(div_hide);
            li.appendChild(div_reset);
            
            elem.classList.add('panel');
            elem.insertBefore(li, elem.firstChild);
        } 
    }

    clearAllPanels(exclude, isForceAll = false) {
        if (isForceAll) {
            this.panels.forEach((panel) => {
                if (panel.elem !== this.domHover && panel.elem !== exclude) {
                    panel.elem.style.display = 'none';
                    if (panel.button)
                        panel.button.style.textDecoration = 'none';
                }
            });
        } else {
            this.panels.forEach((panel) => {
                if (!panel.detach && panel.elem !== this.domHover && panel.elem !== exclude) {
                    panel.elem.style.display = 'none';
                    if (panel.button)
                        panel.button.style.textDecoration = 'none';
                }
            });
        }
    }

    switchPanel(panel) {
        this.clearAllPanels(panel.elem);
        if (panel.elem.style.display === 'unset') {
            panel.elem.style.display = 'none';
            panel.button.style.textDecoration = 'none';
        } else {
            panel.elem.style.display = 'unset';
            panel.button.style.textDecoration = 'underline';
        }
    }

    resetPanel(idx) {
        this.panels[idx].elem.style.transform = 'none';
        this.panels[idx].x = 0;
        this.panels[idx].y = 0;
        this.panels[idx].detach = false;
        this.panels[idx].elem.style.borderTop = 'none';
        this.panels[idx].elem.style.borderRadius = '3px';
        this.panels[idx].elem.style.borderTopLeftRadius = '0';
        this.panels[idx].elem.style.borderTopRightRadius = '0';
        this.switchPanel(this.panels[idx]);
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
        if (MODE == 0) {
            this.domInfo[1].innerHTML = builder.voxels.length + ' VOX';
            this.domInfo[2].innerHTML = palette.uniqueColors.length + ' COL';
        } else if (MODE == 2) {
            this.domInfo[1].innerHTML = bakery.meshes.length + ' MSH';
            this.domInfo[2].innerHTML = scene.getTotalVertices() + ' VTX';
        }
    }

    notification(str, timeout = 2500) {
        if (this.notificationTimer)
            clearTimeout(this.notificationTimer);
        this.domNotifier.innerHTML = str.toUpperCase();
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
                uix.colorPicker.value = BABYLON.Color3.FromHexString(currentColor);
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
            this.domBakeryList.style.display = 'none';
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
                this.domBakeryList.style.display = 'unset';
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
                        getContent: () => bakery.meshes
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
            ui.panels[hIndex].detach = true;
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

    hoverTranslate(elem, idx, x, y) {
        elem.style.transform = "translate(" + x + "px, " + y + "px)";
        this.panels[idx].x = 0;
        this.panels[idx].y = 0;
    }

    isHoverOffScreen(elem, minPad = 20) {
        const rect = elem.getBoundingClientRect();
        return ((rect.x + (rect.width/2) - minPad) < 0 || (rect.x + minPad) > window.innerWidth ||
                (rect.y + minPad) < 0 || (rect.y + minPad) > window.innerHeight);
    }

    offscreenCheck() {
        this.panels.forEach((panel) => {
            if (panel.elem === this.domHover) {
                if (this.isHoverOffScreen(panel.elem))
                    this.hoverTranslate(panel.elem, panel.idx, 0, 0);
            } else {
                if (this.isHoverOffScreen(panel.elem, 60))
                    this.hoverTranslate(panel.elem, panel.idx, 0, 0);
            }
        });
    }

    toggleElem(elem) {
        (elem.style.display === 'unset') ?
            elem.style.display = 'none' :
            elem.style.display = 'unset';
    }

    checkMode(mode) {
        if (MODE !== mode) {
            if (mode == 0) {
                ui.notification('switch to model tab');
                tool.toolSelector('camera');
            } else if (mode == 1) {
                ui.notification('switch to render tab');
            } else if (mode == 2) {
                ui.notification('switch to export tab');
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
        panel.width = "120px";
        panel.height = "120px";
        panel.isVertical = true;
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.advancedTexture.addControl(panel);  

        this.colorPicker = new BABYLON.GUI.ColorPicker();
        this.colorPicker.value = BABYLON.Color3.FromHexString(currentColor);
        this.colorPicker.height = "115px";
        this.colorPicker.width = "115px";
        this.colorPicker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
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
            (mesh) ? bakery.onGizmoAttached(mesh) : bakery.deselectMesh();
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

        this.sunGizmoUp = new BABYLON.AxisScaleGizmo(BABYLON.Axis.Y, COL_AQUA_RGB, this.utilLayer, undefined, 2);
        this.sunGizmoUp.scaleRatio = 0.8;
        this.sunGizmoUp.sensitivity = 5.0;
        this.sunGizmoUp.attachedMesh = null;
        this.sunGizmoUp.uniformScaling = true;
        this.sunGizmoUp.updateGizmoRotationToMatchAttachedMesh = false;
        this.sunGizmoUp.dragBehavior.onDragObservable.add(() => {
            light.updateHeight(light.location.y / this.sunNode.scaling.x);
        });

        this.sunGizmoNews = new BABYLON.PlaneRotationGizmo(BABYLON.Axis.Y, COL_AQUA_RGB, this.utilLayer);
        this.sunGizmoNews.scaleRatio = 0.8;
        this.sunGizmoNews.attachedMesh = null;
        this.sunGizmoNews.updateGizmoRotationToMatchAttachedMesh = false;
        this.sunGizmoNews.dragBehavior.onDragObservable.add(() => {
            light.updateAngle(this.sunNode.rotation.y * 180 / Math.PI);
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


export const engine = new Engine();
export const camera = new Camera();
export const scene = new MainScene().create();
const axisView = new AxisViewScene();
export const preferences = new Preferences();
const renderTarget = new RenderTarget();
export const hdri = new HDRI();
export const light = new Light();
export const ui = new UserInterface();
const uix = new UserInterfaceAdvanced();
const material = new Material();
export const builder = new Builder();
const xformer = new Transformers();
const ghosts = new Ghosts();
const palette = new Palette();
const helper = new Helper();
const tool = new Tool();
const toolBakery = new ToolBakery();
const symmetry = new Symmetry();
const voxelizer = new Voxelizer();
const generator = new Generator();
export const bakery = new Bakery();
const snapshot = new Snapshot();
const memory = new Memory();
const project = new Project();


// -------------------------------------------------------
// Events


engine.webgl.runRenderLoop(() => {
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
        
        if (MODE == 0 && !tool.isMouseDown) {
            camera.lastPos = [ camera.camera0.alpha, camera.camera0.beta ];

            if (duplicateFlag == 1) {
                builder.removeDuplicates();
                duplicateFlag = 0;
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
            if (pInfo.event.button > 0) break;
            if (MODE !== 1) {
                if (!axisView.registerEvent()) {
                    if (MODE == 0) tool.handleToolDown(pInfo.pickInfo);
                    if (MODE == 2) toolBakery.handleToolDown();
                }
            }
            break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
            if (MODE == 0) tool.handleToolMove(pInfo.pickInfo);
            break;
        case BABYLON.PointerEventTypes.POINTERUP:
            if (MODE == 0) tool.handleToolUp();
            break;
        case BABYLON.PointerEventTypes.POINTERWHEEL:
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
            if (MODE == 0) xformer.apply();
            break;
        case '`':
            if (MODE == 0) tool.toolSelector('camera', true);
            break;
        case '1':
            if (MODE == 0) tool.toolSelector('add', true);
            break;
        case '2':
            if (MODE == 0) tool.toolSelector('remove', true);
            break;
        case '3':
            if (MODE == 0) tool.toolSelector('box_add', true);
            break;
        case '4':
            if (MODE == 0) tool.toolSelector('box_remove', true);
            break;
        case '5':
            if (MODE == 0) tool.toolSelector('paint', true);
            break;
        case '6':
            if (MODE == 0) tool.toolSelector('box_paint', true);
            break;
        case '7':
            if (MODE == 0) tool.toolSelector('bucket', true);
            break;
        case '8':
            if (MODE == 0) tool.toolSelector('eyedrop', true);
            break;
        case 't':
            if (MODE == 0) tool.toolSelector('transform_box', true);
            break;
        case 's':
            if (MODE == 0) symmetry.switchAxis();
            break;
        case 'c':
            if (MODE == 0) {
                tool.toolSelector('camera', true);
            } else if (MODE == 2) {
                bakery.cloneSelected();
            }
            break;
        case 'delete':
            if (MODE == 0) {
                xformer.deleteSelected();
            } else if (MODE == 2) {
                bakery.deleteSelected();
            }
            break;
        case 'f':
            if (xformer.isActive) {
                camera.setFramingBehavior(camera.camera0, ghosts.thin);
            } else {
                (modules.pt.isActive()) ?
                    modules.pt.frameCamera() : camera.frame();
            }
            break;
        case 'o':
            if (MODE != 1) camera.switchOrtho();
            break;
        case 'r':
            if (modules.pt && modules.pt.isActive()) {
                (ui.domRenderSource.value == 'model') ? ui.setMode(0) : ui.setMode(2);
            } else {
                ui.setMode(1);
            }
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
    renderTarget.pickTexture.resize({ width: scene.getEngine().getRenderWidth(), height: scene.getEngine().getRenderHeight() });
    
    material.updateCelMaterial();

    axisView.updateViewport();

    if (MODE == 0) palette.create();
    if (MODE == 2) bakery.createBakeryList();

    ui.offscreenCheck();

    if (modules.pt.isLoaded)
        modules.pt.resize();
}, false);


// -------------------------------------------------------
// Events File


function fileHandler(file) {
    const ext = file.name.split('.').pop().toLowerCase(); //ext|exts
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = () => {
        if (ext == 'json') project.load(reader.result);
        if (ext == 'obj') if (MODE == 0) voxelizer.importMeshOBJ(url);
        if (ext == 'glb') if (MODE == 0) voxelizer.importMeshGLB(url);
        if (ext == 'vox') project.loadMagicaVoxel(reader.result);
        if (ext == 'hdr') hdri.loadHDR(url);
        if (MODE == 0) {
            if (['jpg','png','svg'].includes(ext)) voxelizer.voxelize2D(reader.result);
        } else if (MODE == 2) {
            if (['jpg','png'].includes(ext)) material.addTexture(reader.result);
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

document.getElementById('openfile_tex').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandler(ev.target.files[0]);
}, false);

document.getElementById('openfile_hdr').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandler(ev.target.files[0]);
}, false);


// -------------------------------------------------------
// Events DOM


ui.domMenus.addEventListener('pointerdown', (ev) => {
    if (MODE == 0) { // prevent premature usage!
        if (ev.target !== canvas && ev.target !== ui.domHover) {
            xformer.apply();
            helper.clearOverlays();
        }
    }
}, false);

ui.domHover.children[0].onclick = () => { tool.toolSelector('camera') };
ui.domHover.children[0].onpointerdown = (ev) => { ui.dragElement(0, ev.target, ev.target.parentElement) };
ui.domHover.children[1].onclick = () => { tool.toolSelector('box_paint') };
ui.domHover.children[2].onclick = () => { tool.toolSelector('box_add') };
ui.domHover.children[3].onclick = () => { tool.toolSelector('box_remove') };
ui.domHover.children[4].onclick = () => { tool.toolSelector('bucket') };
ui.domHover.children[5].onclick = () => { tool.toolSelector('remove') };
ui.domHover.children[6].onclick = () => { tool.toolSelector('paint') };
ui.domHover.children[7].onclick = () => { tool.toolSelector('add') };
ui.domHover.children[8].onclick = () => { tool.toolSelector('eyedrop') };
ui.domHover.addEventListener('pointerdown', () => {
    xformer.apply();
    helper.clearOverlays();
}, false);

ui.domColorPicker.addEventListener('input', (ev) => {
    currentColor = ev.target.value.toUpperCase();
    uix.colorPicker.value = BABYLON.Color3.FromHexString(currentColor);
}, false);

ui.domColorPickerAlbedo.addEventListener('input', (ev) => {
    currentColorBake = ev.target.value.toUpperCase();
    bakery.setMaterial('albedo'); // update material
}, false);

ui.domColorPickerEmissive.addEventListener('input', () => {
    bakery.setMaterial('emissive');
}, false);

ui.domColorPickerVertexColor.addEventListener('input', (ev) => {
    (bakery.meshes.length > 0) ?
        bakery.updateVertexColors(ev.target.value) :
        ui.notification('select a mesh');
}, false);

ui.domColorPickerBackground.addEventListener('input', (ev) => {
    scene.clearColor = BABYLON.Color4.FromHexString(ev.target.value);
    scene.autoClear = ui.domBackgroundCheck.checked;
}, false);

ui.domColorPickerLightColor.addEventListener('input', (ev) => {
    light.updateColor(ev.target.value);
}, false);

ui.domCameraFov.addEventListener('change', (ev) => {
    if (ev.target.value > 0) {
        scene.activeCamera.fov = ev.target.value;
        if (modules.pt.isActive && modules.pt.isLoaded) {
            modules.pt.camera.fov = ev.target.value * RAD2DEG_STATIC;
            modules.pt.camera.updateProjectionMatrix();
            modules.pt.resetSamples();
        }
    }
}, false);

ui.domRenderSource.onchange = () => {
    if (modules.pt.isLoaded) {
        modules.pt.createGeometry();
        modules.pt.resetSamples();
    }
};

ui.domRenderMaxSamples.onchange = (ev) => {
    if (ev.target.value < 8) ev.target.value = 8;
    if (modules.pt.isLoaded) {
        modules.pt.update();
        modules.pt.updateUniformMaxSamples(ev.target.value);
    }
};

ui.domRenderPasses.onchange = (ev) => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformRenderPassId(ev.target.value);
};

ui.domRenderBounces.onchange = (ev) => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformBounces(ev.target.value);
};

ui.domRenderEnvPower.onchange = (ev) => {
    if (ev.target.value < 1) ev.target.value = 1;
    if (modules.pt.isLoaded)
        modules.pt.updateUniformEnvPower(ev.target.value);
};

ui.domRenderEnvPower.onwheel = (ev) => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformEnvPower(ev.target.value);
};

ui.domRenderDirectLight.oninput = (ev) => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformDirectLight(ev.target.checked);
};

ui.domRenderBackground.oninput = (ev) => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformBackground(ev.target.checked);
};

ui.domRenderMaterial.onchange = (ev) => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformMaterialId(ev.target.value);
};

ui.domRenderEmissive.oninput = (ev) => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformMaterialEmissive(ev.target.value);
};

ui.domRenderRoughness.oninput = (ev) => {
    if (modules.pt.isLoaded && ev.target.value > 0)
        modules.pt.updateUniformMaterialRoughness(ev.target.value);
};

ui.domRenderGrid.oninput = (ev) => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformGrid(ev.target.checked);
};

ui.domRenderShade.oninput = () => {
    if (modules.pt.isLoaded)
        modules.pt.updateAttributeColors();
};

ui.domRenderFloor.oninput = () => {
    if (modules.pt.isLoaded)
        modules.pt.createGeometry(false);
};

ui.domRenderPause.onclick = () => {
    if (modules.pt.isLoaded)
        modules.pt.pause();
};

ui.domRenderShot.onclick = () => {
    if (modules.pt.isLoaded)
        modules.pt.shot();
};

ui.domRenderFast.onclick = () => {
    modules.pt.fastMode();
};

ui.domCameraAperture.onchange = (ev) => {
    if (modules.pt.isLoaded && ev.target.value > 0)
        modules.pt.updateUniformCameraAperture(ev.target.value);
};

ui.domCameraFocalLength.onchange = (ev) => {
    if (modules.pt.isLoaded && ev.target.value > 0)
        modules.pt.updateUniformCameraFocalLength(ev.target.value);
};

ui.domColorPickerLightColor.oninput = (ev) => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformLightCol(ev.target.value);
};

ui.domLightIntensity.onchange = () => {
    if (modules.pt.isLoaded)
        modules.pt.updateUniformLightCol(ui.domColorPickerLightColor.value);
};

document.getElementById('btn-light-defaultsun').onclick = () => {
    ui.domColorPickerLightColor.value = '#EDD59E';
    light.updateColor('#EDD59E');
    if (modules.pt.isActive)
        modules.pt.updateUniformLightCol('#EDD59E');
};

document.getElementById('fullscreen').onclick = () =>               { toggleFullscreen() };
document.getElementById('frame_camera').onclick = () =>             { camera.frame() };
document.getElementById('tab-model').onclick = () =>                { ui.setMode(0) };
document.getElementById('tab-render').onclick = () =>               { ui.setMode(1) };
document.getElementById('tab-export').onclick = () =>               { ui.setMode(2) };
document.getElementById('about_shortcuts').onclick = () =>          { ui.toggleElem(document.getElementById('shortcuts')) };
document.getElementById('about_examples').onchange = (ev) =>        { project.loadFromUrl(ev.target.options[ev.target.selectedIndex].value) };
document.getElementById('about_examples_vox').onchange = (ev) =>    { project.loadFromUrl(ev.target.options[ev.target.selectedIndex].value) };
document.getElementById('pref_startup').onclick = (ev) =>           { preferences.setStartup(ev.target.checked) };
document.getElementById('pref_nohover').onclick = (ev) =>           { preferences.setNoHover(ev.target.checked) };
document.getElementById('pref_floorplane').onclick = (ev) =>        { preferences.setFloorPlane(ev.target.checked) };
document.getElementById('pref_pointcloud').onclick = (ev) =>        { preferences.setPointCloud(ev.target.checked) };
document.getElementById('pref_powersaver').onclick = (ev) =>        { preferences.setPowerSaver(ev.target.checked) };
document.getElementById('pref_palette_size').oninput = (ev) =>      { palette.expand(ev.target.value) };
document.getElementById('reset_hover').onclick = () =>              { ui.hoverTranslate(ui.domHover, 0, 0, 0) };
document.getElementById('clear_cache').onclick = (ev) =>            { clearCache(ev.target) };
document.getElementById('ws_connect').onclick = () =>               { if (ui.checkMode(0)) modules.ws_client.connect() };
document.getElementById('new_project').onclick = () =>              { project.newProject() };
document.getElementById('save_project').onclick = () =>             { project.save() };
document.getElementById('export_voxels').onclick = () =>            { project.exportVoxels() };
document.getElementById('export_bakes').onclick = () =>             { project.exportBakes() };
document.getElementById('screenshot').onclick = () =>               { createScreenshot() };
document.getElementById('create_box').onclick = () =>               { if (ui.checkMode(0)) generator.createBox() };
document.getElementById('create_plane').onclick = () =>             { if (ui.checkMode(0)) generator.createBox(true) };
document.getElementById('create_isometric').onclick = () =>         { if (ui.checkMode(0)) generator.createIsometric() };
document.getElementById('create_sphere').onclick = () =>            { if (ui.checkMode(0)) generator.createSphere() };
document.getElementById('create_terrain').onclick = () =>           { if (ui.checkMode(0)) generator.createTerrain() };
document.getElementById('import_mesh_url').onclick = (ev) =>        { if (ui.checkMode(0)) voxelizer.loadFromUrl(ev.target.previousElementSibling.value) };
document.getElementById('import_image_paste').onclick = () =>       { if (ui.checkMode(0)) voxelizer.pasteBase64Image() };
document.getElementById('import_image_url').onclick = (ev) =>       { if (ui.checkMode(0)) voxelizer.loadFromUrlImage(ev.target.previousElementSibling.value) };
document.getElementById('btn-symm-axis-s').onclick = () =>          { symmetry.switchAxisByNum(-1) };
document.getElementById('btn-symm-axis-x').onclick = () =>          { symmetry.switchAxisByNum(0) };
document.getElementById('btn-symm-axis-y').onclick = () =>          { symmetry.switchAxisByNum(1) };
document.getElementById('btn-symm-axis-z').onclick = () =>          { symmetry.switchAxisByNum(2) };
document.getElementById('symm_p2n').onclick = () =>                 { if (ui.checkMode(0)) symmetry.symmetrizeVoxels(1) };
document.getElementById('symm_n2p').onclick = () =>                 { if (ui.checkMode(0)) symmetry.symmetrizeVoxels(-1) };
document.getElementById('symm_mirror').onclick = () =>              { if (ui.checkMode(0)) symmetry.mirrorVoxels() };
document.getElementById('symm_p_half').onclick = () =>              { if (ui.checkMode(0)) symmetry.deleteHalfVoxels(-1) };
document.getElementById('symm_n_half').onclick = () =>              { if (ui.checkMode(0)) symmetry.deleteHalfVoxels(1) };
document.getElementById('input-symm-center').onclick = () =>        { if (ui.checkMode(0)) helper.setSymmPivot() };
document.getElementById('btn_tool_add').onclick = () =>             { if (ui.checkMode(0)) tool.toolSelector('add') };
document.getElementById('btn_tool_remove').onclick = () =>          { if (ui.checkMode(0)) tool.toolSelector('remove') };
document.getElementById('btn_tool_box_add').onclick = () =>         { if (ui.checkMode(0)) tool.toolSelector('box_add') };
document.getElementById('btn_tool_box_remove').onclick = () =>      { if (ui.checkMode(0)) tool.toolSelector('box_remove') };
document.getElementById('btn_tool_rect_add').onclick = () =>        { if (ui.checkMode(0)) tool.toolSelector('rect_add') };
document.getElementById('btn_tool_rect_remove').onclick = () =>     { if (ui.checkMode(0)) tool.toolSelector('rect_remove') };
document.getElementById('input-newbox-coord').onkeydown = (ev) =>   { if (ui.checkMode(0)) generator.newBoxPosition(ev, ev.target) };
document.getElementById('btn_tool_paint').onclick = () =>           { if (ui.checkMode(0)) tool.toolSelector('paint') };
document.getElementById('btn_tool_box_paint').onclick = () =>       { if (ui.checkMode(0)) tool.toolSelector('box_paint') };
document.getElementById('btn_tool_rect_paint').onclick = () =>      { if (ui.checkMode(0)) tool.toolSelector('rect_paint') };
document.getElementById('btn_tool_bucket').onclick = () =>          { if (ui.checkMode(0)) tool.toolSelector('bucket') };
document.getElementById('paint_all').onclick = () =>                { if (ui.checkMode(0)) builder.setAllColorsAndUpdate() };
document.getElementById('btn_tool_eyedrop').onclick = () =>         { if (ui.checkMode(0)) tool.toolSelector('eyedrop') };
document.getElementById('activate_pixeleyedrop').onclick = () =>    { ui.activateEyedropper() };
document.getElementById('btn_tool_transform_box').onclick = () =>   { if (ui.checkMode(0)) tool.toolSelector('transform_box') };
document.getElementById('btn_tool_transform_rect').onclick = () =>  { if (ui.checkMode(0)) tool.toolSelector('transform_rect') };
document.getElementById('btn_tool_transform_group').onclick = () => { if (ui.checkMode(0)) tool.toolSelector('transform_group') };
document.getElementById('btn_tool_transform_visible').onclick = ()=>{ if (ui.checkMode(0)) tool.toolSelector('transform_visible') };
document.getElementById('normalize_voxels').onclick = () =>         { if (ui.checkMode(0)) builder.normalizeVoxelPositions(true) };
document.getElementById('btn_tool_measure_volume').onclick = () =>  { if (ui.checkMode(0)) tool.toolSelector('measure_volume') };
document.getElementById('btn_tool_measure_color').onclick = () =>   { if (ui.checkMode(0)) tool.toolSelector('measure_color') };
document.getElementById('reduce_voxels').onclick = () =>            { if (ui.checkMode(0)) builder.reduceVoxels() };
document.getElementById('bake_add').onclick = () =>                 { bakery.newBake() };
document.getElementById('btn_tool_bakecolor').onclick = () =>       { if (ui.checkMode(0)) tool.toolSelector('bake_color') };
document.getElementById('bake_all').onclick = () =>                 { bakery.bakeAll() };
document.getElementById('bake_allcolors').onclick = () =>           { bakery.bakeAllColors() };
document.getElementById('clear_bakes').onclick = () =>              { bakery.clearBakes(true) };
document.getElementById('clone_bake').onclick = () =>               { if (ui.checkMode(2)) bakery.cloneSelected() };
document.getElementById('merge_bakes_pick').onclick = () =>         { if (ui.checkMode(2)) toolBakery.toolSelector('merge') };
document.getElementById('merge_bakes_merge').onclick = () =>        { if (ui.checkMode(2)) toolBakery.mergeBakes() };
document.getElementById('merge_bakes_cancel').onclick = () =>       { if (ui.checkMode(2)) toolBakery.cancelSelection() };
document.getElementById('merge_all_bakes').onclick = () =>          { if (ui.checkMode(2)) bakery.mergeAll() };
document.getElementById('voxelize_bake').onclick = () =>            { if (ui.checkMode(2)) voxelizer.voxelizeBake() };
document.getElementById('reset_bake_rotation').onclick = () =>      { if (ui.checkMode(2)) bakery.resetRotation() };
document.getElementById('delete_bake').onclick = () =>              { if (ui.checkMode(2)) bakery.deleteSelected() };
document.getElementById('camera_frame').onclick = () =>             { camera.frame() };
document.getElementById('btn_tool_frame_color').onclick = () =>     { if (ui.checkMode(0)) tool.toolSelector('frame_color') };
document.getElementById('btn_tool_frame_voxels').onclick = () =>    { if (ui.checkMode(0)) tool.toolSelector('frame_voxels') };
document.getElementById('btn-ortho').onclick = () =>                { camera.switchOrtho() };
document.getElementById('input-camera-fov').oninput = (ev) =>       { camera.setFov(ev.target.value) };
document.getElementById('input-autorotate').onclick = () =>         { camera.toggleCameraAutoRotation() };
document.getElementById('input-autorotate-ccw').onclick = () =>     { camera.updateCameraAutoRotation() };
document.getElementById('input-env-bgcheck').onclick = (ev) =>      { scene.autoClear = ev.target.checked };
document.getElementById('hdri_dropdown').onclick = (ev) =>          { hdri.loadHDR(ev.target.options[ev.target.selectedIndex].value) };
document.getElementById('unload_hdri').onclick = () =>              { hdri.unloadHDR(true) };
document.getElementById('input-hdri-toggle').onclick = (ev) =>      { hdri.showSkybox(ev.target.checked) };
document.getElementById('input-hdri-blur').oninput = (ev) =>        { hdri.setBlurAmount(ev.target.value) };
document.getElementById('input-light-intensity').oninput = (ev) =>  { light.updateIntensity(ev.target.value) };
document.getElementById('input-light-shadows').onclick = (ev) =>    { light.enableShadows(ev.target.checked) };
document.getElementById('bake_tex_solid').onclick = () =>           { material.setPBRTexture(0); bakery.replaceTexture() };
document.getElementById('bake_tex_outline').onclick = () =>         { material.setPBRTexture(1); bakery.replaceTexture() };
document.getElementById('bake_tex_grid').onclick = () =>            { material.setPBRTexture(2); bakery.replaceTexture() };
document.getElementById('bake_tex_checker').onclick = () =>         { material.setPBRTexture(3); bakery.replaceTexture() };
document.getElementById('btn_tool_isolate_color').onclick = () =>   { if (ui.checkMode(0)) tool.toolSelector('isolate_color') };
document.getElementById('btn_tool_hide_color').onclick = () =>      { if (ui.checkMode(0)) tool.toolSelector('hide_color') };
document.getElementById('invert_visibility').onclick = () =>        { if (ui.checkMode(0)) builder.invertVisibilityAndUpdate() };
document.getElementById('unhide_all').onclick = () =>               { if (ui.checkMode(0)) builder.setAllVisibilityAndUpdate(true) };
document.getElementById('btn_tool_delete_color').onclick = () =>    { if (ui.checkMode(0)) tool.toolSelector('delete_color') };
document.getElementById('delete_hidden').onclick = () =>            { if (ui.checkMode(0)) builder.deleteHiddenAndUpdate() };
document.getElementById('btn_tool_bucket_inscreen').onclick = () => { if (ui.checkMode(0)) tool.toolSelector('bucket') };
document.getElementById('material-switch').onclick = () =>          { material.switchMaterial() };
document.getElementById('btn-inscreen-symmetry').onclick = () =>    { symmetry.switchAxis() };
document.getElementById('btn-inscreen-gridplane').onclick = () =>   { helper.toggleWorkplane(0) };
document.getElementById('btn-inscreen-workplane').onclick = () =>   { helper.toggleWorkplane(1) };
document.getElementById('btn-inscreen-lightlocator').onclick = () =>{ uix.toggleLightLocator() };
document.getElementById('btn-inscreen-ortho').onclick = () =>       { camera.switchOrtho() };
document.getElementById('axisview-hitbox').onclick = () =>          { camera.frame() };
document.getElementById('input-material-roughness').oninput = (ev) => { bakery.setMaterial('roughness'); document.getElementById('input-material-roughness-range').value = ev.target.value };
document.getElementById('input-material-roughness-range').oninput = (ev) => { document.getElementById('input-material-roughness').value = ev.target.value; bakery.setMaterial('roughness') };
document.getElementById('input-material-metallic').oninput = (ev) => { bakery.setMaterial('metallic'); document.getElementById('input-material-metallic-range').value = ev.target.value };
document.getElementById('input-material-metallic-range').oninput = (ev) => { document.getElementById('input-material-metallic').value = ev.target.value; bakery.setMaterial('metallic') };
document.getElementById('input-material-alpha').oninput = (ev) => { bakery.setMaterial('alpha'); document.getElementById('input-material-alpha-range').value = ev.target.value };
document.getElementById('input-material-alpha-range').oninput = (ev) => { document.getElementById('input-material-alpha').value = ev.target.value; bakery.setMaterial('alpha') };


// -------------------------------------------------------
// Utils


function clearScene(frameCamera = true) {
    memory.clear();
    symmetry.resetAxis();
    if (frameCamera) {
        setTimeout(() => {
            camera.frame();
        }, 10);
    }
}

function clearSceneAndReset() {
    ui.setMode(0);
    clearScene();

    scene.clearColor = BABYLON.Color4.FromHexString(DEF_BGCOLOR);
    scene.autoClear = false;
    
    tool.toolSelector('camera');
    helper.enableFloorPlane(false);
    helper.enableWorkplane(false);
    light.updateColor(DEF_LIGHTCOLOR);
    bakery.clearBakes();
    uix.hideLightLocator();

    ui.domColorPickerLightColor.value = DEF_LIGHTCOLOR;
    ui.domColorPickerBackground.value = DEF_BGCOLOR;
    ui.domBackgroundCheck.checked = false;
}

function CustomLoadingScreen() {
    CustomLoadingScreen.prototype.displayLoadingUI = () => {
        document.getElementById('loadingscreen').style.display = 'unset';
    }
    CustomLoadingScreen.prototype.hideLoadingUI = () => {
        document.getElementById('loadingscreen').style.display = 'none';
    }
}

function displayLoading(display) {
    (display) ? scene.getEngine().displayLoadingUI() : scene.getEngine().hideLoadingUI();
}

const easingFunction = new BABYLON.CubicEase();
easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
function animator(target, property, from, to, fps=2, frames=1, callback=null) {
    BABYLON.Animation.CreateAndStartAnimation('animator',
        target, property, fps, frames, from, to, 
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        easingFunction, callback);
}

function highlightOverlayMesh(mesh, color3, alpha = 0.5) {
    mesh.renderOverlay = true;
    mesh.overlayAlpha = alpha;
    mesh.overlayColor = color3;
}

function highlightOutlineMesh(mesh, color3, width = 0.05) {
    mesh.renderOutline = true;
    mesh.outlineColor = color3;
    mesh.outlineWidth = width;
}

function highlightEdgesMesh(mesh, color4, width = 6) { // do not use in performance cases
    mesh.edgesWidth = width;
    mesh.edgesColor = color4;
    mesh.enableEdgesRendering();
    fixEdgesWidth(mesh);
}

function fixEdgesWidth(mesh) {
    mesh.edgesWidth = scene.activeCamera.radius/8;
    if (scene.activeCamera.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA)
        mesh.edgesWidth /= 4;
}

function updateViewport(w, h, bottom, right) {
    return new BABYLON.Viewport(1 - (w + right) / canvas.width, 1 - (bottom + canvas.height) / canvas.height,   w / canvas.width, h / canvas.height);
}

function getMeshSize(bounds) {
    return new BABYLON.Vector3(
        Math.abs(bounds.minimum.x - bounds.maximum.x),
        Math.abs(bounds.minimum.y - bounds.maximum.y),
        Math.abs(bounds.minimum.z - bounds.maximum.z)
    );
}

function normalizeMesh(mesh, scale) {
    const bounds = mesh.getBoundingInfo();
    const size = getMeshSize(bounds);

    const scaleFactor = Math.min(scale / size.x, scale / size.y, scale / size.z);
    const scaleMatrix = BABYLON.Matrix.Scaling(scaleFactor, scaleFactor, scaleFactor);

    const nX = (-bounds.maximum.x + (size.x / 2)) + (size.x / 2);
    const nY = ((size.y / 2) - bounds.boundingBox.center.y);
    const nZ = (-bounds.maximum.z + (size.z / 2)) + (size.z / 2);
    const transMatrix = BABYLON.Matrix.Translation(nX, nY, nZ);

    mesh.bakeTransformIntoVertices(transMatrix.multiply(scaleMatrix));
}

function resetPivot(mesh) {
    const center = mesh.getBoundingInfo().boundingSphere.centerWorld;
    mesh.setPivotMatrix(BABYLON.Matrix.Translation(-center.x, -center.y, -center.z), false);
    mesh.bakeCurrentTransformIntoVertices();
    mesh.setPivotMatrix(BABYLON.Matrix.Identity());
    mesh.position = center;
    mesh.refreshBoundingInfo();
}

function createScreenshot(scale = 4) {
    // take shot larger to improve pixel density
    if (MODE !== 1) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        scene.getEngine().setSize(canvasWidth * scale, canvasHeight * scale);
        isRenderAxisView = false;
        uix.colorPicker.isVisible = false;
        BABYLON.ScreenshotTools.CreateScreenshotWithResizeAsync(scene.getEngine(),
            scene.activeCamera, canvasWidth * scale, canvasHeight * scale).then(() => {
                isRenderAxisView = true;
                uix.colorPicker.isVisible = (MODE == 0);
                scene.getEngine().setSize(canvasWidth, canvasHeight);
        });
    } else {
        ui.notification('use "shot" to capture renderer');
    }
}

function createScreenshotBasic(width, height, callback) {
    isRenderAxisView = false;
    uix.colorPicker.isVisible = false;
    BABYLON.ScreenshotTools.CreateScreenshot(scene.getEngine(),
        scene.activeCamera, { width: width, height: height }, (data) => {
            isRenderAxisView = true;
            uix.colorPicker.isVisible = (MODE == 0);
            callback(data);
    });
}

function clearCache(elem) {
    scene.getEngine().clearInternalTexturesCache();
    scene.cleanCachedTextureBuffer();
    BABYLON.Tools.ClearLogCache();
    memory.clear();
    elem.innerHTML = 'Cleared';
    setTimeout(() => {
        elem.innerHTML = 'Clear Cache';
    }, 800);
}

const isTargetIn = (startPos, endPos, target, camera) => {
    const targetScreenPosition = BABYLON.Vector3.Project(
        target,
        BABYLON.Matrix.IdentityReadOnly,
        scene.getTransformMatrix(),
        camera.viewport.toGlobal(
            scene.getEngine().getRenderWidth(),
            scene.getEngine().getRenderHeight()
        )
    );
    if (targetScreenPosition.x >= Math.min(startPos.x, endPos.x) &&
        targetScreenPosition.x <= Math.max(startPos.x, endPos.x) &&
        targetScreenPosition.y >= Math.min(startPos.y, endPos.y) &&
        targetScreenPosition.y <= Math.max(startPos.y, endPos.y)) {
        return true;
    }
    return false;
}

function numToColor(num) {
    return [ 
        ((num & 0xff0000) >> 16),
        ((num & 0x00ff00) >>  8),
        ((num & 0x0000ff) >>  0)
     ];
}

function readTexturePixels(gl, texture, x, y, w, h) {
    const frameBuffer = gl.createFramebuffer();
    const pixels = new Uint8Array(w * h * 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels;
}

function removeDuplicatesArray(arr) {
    return arr.filter((value, index, self) =>
        index === self.findIndex(i =>
            i.position.x == value.position.x &&
            i.position.y == value.position.y &&
            i.position.z == value.position.z
        ));
}

function loadUrl(url, callback, onerror = null) {
    fetch(url).then((res) => {
        if (res.status !== 200) {
            if (onerror) onerror();
            return;
        }
        res.text().then((data) => {
            callback(data);
        });
    }).catch((err) => {
        if (onerror) onerror();
    });
}

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

function isElectron() {
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') return true;
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) return true;
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) return true;
    return false;
}

function aspectRatioFit(srcW, srcH, maxW, maxH) {
    const ratio = Math.min(maxW / srcW, maxH / srcH);
    return { width: srcW * ratio, height: srcH * ratio };
}

function getStyleRoot(key) {
    return getComputedStyle(document.querySelector(':root')).getPropertyValue(key);
}

function rgbIntToHex(r, g, b) {
    return '#' + (0x1000000 + b | (g << 8) | (r << 16)).toString(16).slice(1).toUpperCase();
}

function rgbIntToHexGamma(r, g, b, gamma) {
    r = 255 * Math.pow(r / 255, gamma);
    g = 255 * Math.pow(g / 255, gamma);
    b = 255 * Math.pow(b / 255, gamma);
    return '#' + (0x1000000 + b | (g << 8) | (r << 16)).toString(16).slice(1).toUpperCase();
}

function rgbFloatToHex(r, g, b) { // thanks to @labris
    const hr = Math.max(0, Math.min(255, Math.round(r * 255))).toString(16);
    const hg = Math.max(0, Math.min(255, Math.round(g * 255))).toString(16);
    const hb = Math.max(0, Math.min(255, Math.round(b * 255))).toString(16);
    return ("#" +
        (hr.length<2?"0":"") + hr +
        (hg.length<2?"0":"") + hg +
        (hb.length<2?"0":"") + hb).toUpperCase();
}

function hexToRgbFloat(hex, gamma = 2.2) { // 1 / 0.4545
    return {
        r: Math.pow(parseInt(hex.substring(1, 3), 16) / 255, gamma),
        g: Math.pow(parseInt(hex.substring(3, 5), 16) / 255, gamma),
        b: Math.pow(parseInt(hex.substring(5, 7), 16) / 255, gamma)
    }
}

function randomHexColor() {
    return "#000000".replace(/0/g, () => {
        return (~~(Math.random()*16)).toString(16).toUpperCase();
    });
}

function gradientHexArray(hexStart, hexEnd, count) {
    const start = hexToRgbFloat(hexStart);
    const end = hexToRgbFloat(hexEnd);
    const arr = [];
    let a = 0;
    for (let i = 0; i < count; i++) {
        a += (1 / count);
        arr.push(rgbFloatToHex(
            start.r * a + (1 - a) * end.r,
            start.g * a + (1 - a) * end.g,
            start.b * a + (1 - a) * end.b
        ));
    }
    return arr;
}

function getCanvasColor(context, x, y) {
    const data = context.getImageData(x, y, 1, 1).data;
    if (data[3] > 0) return rgbIntToHex(data[0], data[1], data[2]);
    return null;
}

function parseBool(val) {
    return val === true || val === "true";
}
