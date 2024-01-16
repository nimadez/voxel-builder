/*
    Aug 2019
    @nimadez

    [ Code Map ]
    01. Initialize
    02. Render Loops
    03. Scene
    04. Camera
    05. Light
    06. HDRI and Skybox
    07. Material
    08. Builder
    09. Ghosts
    10. Transformers
    11. Palette (color palette)
    12. Helper (overlays)
    13. Tool
    14. Symmetry
    15. Voxelizer
    16. Generator
    17. Bakery
    18. Snapshot
    19. Memory
    20. Project
    21. UserInterface
    22. UserInterfaceAdvanced
    23. Preferences
    24. Events
    25. Websocket
    26. Utils
*/

const ENVMAP = "assets/snow_field_2_puresky_1k.hdr";
const PARTICLE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wgaExY5fZXYlgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAASFUlEQVR42u1bS48bR5KOR2ZV8dHsh97WeD2Y82IxEI996YMAw/9jftb8j8ECPVgBgz74QP+AgS0YMNAtW61+kyxWZkbsIbPIYrHYLcmaxQK7BFJksyiy4osvIiPjAfD/j//bD/ySX/aXv/wFW9+LD6zmQxvP9y3461//qv+rAGgJXi96YDVBaAoo96z6OnwpMPALCl4Lxem1Sa9N6zWn1WZBLWQAAN94br6ur0sTtN8DAn4hjVNDMNtYWWvZw/HYQrHDvZ5h8IBgADx4BQ/inPNlWfrJZOIAwAFA1XiuXzdBCb8XCPwdwjfpbJLAeVoFABRjgN7O0VGR93qFZVswY27IZMhoAMEg4NIEFDSogBcJVQihEucWpXPl5eW8nExO5gBQprVIqwYptEzkk8wCP0N4bFDdNDTdS2tweHg4GI6GwyIrBsbagWHuE1GPiQogyhAxIwRGQEp3KqoaVNWpqhORUkTKEPxcJEzdwk1nZTm9PD6eTgCmADADgHkComowogbio0HAzxCeGlSvBe8DwPDo8Gg03B+OcpuPTGZGhs0OMw+JaYCEPSIuECAnjAyAyAAEAFHQAAJeQSsRXajKXCTMQpBp8OHOeXfjnLspp+XNf16e38JkcgsrMGog1sziY0DAzxDeJMHzJPjOeHw4evFitJ/n/b3M2n02Zt8Ys8tEO0g8JMI+EfUQMUdECwAGERkBUREAVFUVBEB9YkGlqqWqzIPoVEK4CyFce++vnXNXVbW4nE5nV8fHx1cAcAsAd4kRVcMsPgoE/AThuSF8DwAGALD7+vXr/cFg56Ao8kfWmsfGmANm3mPmXSIaEtEAEQsiyhHRYtQ8AwAhIAFG+WsPr6BeRb2qViJSqupcRO5CCLchhOsQwqV37sPCVR8W5eLD2dnlxWRycg0ANw021M7yQRDwE4XPk/A7Y4C9p99992gw6D/JsvyJtfaJYfOIDR8w8S4S7TBTn4gKQMgIySKiAQBGREKA5AMVQUE17fGquuYPVHQhKvMQwp2I3obgr0IIH7xz55Vz78v5/P31zc35mzdvLgDgOplF+bEg4EfSvrb3PgCMxoeHBy/29x/3er1neZ4/s9Y+ZeYnxpgDIt5jpiFRFB4RLSFZQGBCJEAkROyMBGsmJBBEVbyIOlWpRHQuItPEhMsEwm8L535dlOWvt7e3vx0fH38AgKtkEmXDL2x1jOYTbD4KPz48ePno0dNer/c8y7IX1trnxpinzHxgmPeIeUhEfUTMicgSESMiQ9I6IiIg1tI3I0GI8kcg4oOESIOIOEIpAlKPkHoUTaqIPoUyQjRARK9fv8bj4+PO8LkRQa49+IF9vmnzo/F4fPDi5bNn/V7/RZ7nL7M8e2mNfWGMeWqtfcTMu8w8ZOYeM+dEZJnIIDEzERERxn8RiRDT30jxD4zvE+HqQYjIiMhIZBAxLiIb/QmadA0JAMgY/cPLl+Ht27fS2BGWUeOrV6/ghx9+uB+AV69e1dqv9/geAAwBYH88/vPTQX/4VZ5lL22WvTTWvjDWPEmOb5eZ+8xcMHPGRIZqsVfCR6kiBIgtSZeyE0L9SYisIYhvcVq1L0nPQIQICCiGSJ49f+5//vln3xUktUEwD+z1S+1/9+13B0Vv8DTLsufGZi+MNc+N4SfMZp+Jdpi5IKKMiAwhEq6EjSJESQBT8IeIbQ8Q1RStAFUVVBUQEVQVURAFdYkXABAgkAGDAKCgIKoQVNWPRrtuPB67yWTSBYJuZUDSftvud4+Ojh7t7u0+L4reyyzLXlobac+GDzgGOz0iyonIEBEnzSMz1xQHIoKoWQJEjH8nQBARID0T4dr7tcSw2jZWrABIThUoBVUKAAGRQp7n7p///Gc7XN4wBfOA9vswhtFoNDrIsuxJZuxTY8wTZn7EzHtMPGSiHhFlzGSImFYU7xByyYLuDSg5Qai131yogAKa3OjSiRbxP7AwQ9o6oVKVMoRi/vr16/nx8XHZCpCkyQLu0D43orzdb//j28eDweB5ludfWWu/MsY8N8Y8MswjMqbPRDkxGSamhlMDYoZa80sGNEDZDs72BUtjAlSorQobJ1NV1Xh0VoAKARbD4XBxdnbm2hFizQJzT5zfG48Ph0XR38sy+8gwPzKGD5YRHlOPo80zEy9dd1PYpqDwgA9oaj/Z/cYCABARRCRlBlrtnlqoamA2uyK6EOFZZsytz7Lbx48f36XgaN7FAm5pnxqOb/fPf/73R4NB8SzLiq+Wds+8b4zZYeaCiQ0l1a/ZehK8DUQ3C6Ly7mcDtEHDVjC3llhRjYcqUChFZT4cDsuzs7NFOzB69erV2i6wHvKOx/0sy0bGZHuN2H6HiPqEmCGSQcJa+C0CIiBSS5Dk8Bo/W8vV1v7qQUCkICJASFFNAKgKgKhERKyqVlULIhow00gC77E1e5m1u/v7jy+TUmcJBKpBMB2ZHQsAxdHOft/abIeZR8Q0IsKdFN7mSGRTTIMNT32vjW9oOKp0zQRq4WttqyqoyDKEi2GBAMpyx0AAAlUlJDIoYik65QExjTjQyNpsVBT5MDnMrJGyQwBQ6mCABYB8OLR9a3jIzDuMNCTiKDwuw1taBTG0XWAiwC6/0Pr8NtOJn0vX1r537TXGwJJMikV6kQm8w8zDPLeDw8PDXgLANJOyppXUZACwYxgXbLM+MQ+IeBifqUDEDAlNI2Jd3kxkdn1TDWE3tB8p394K2wxoPogARNZ9AylFv4+KhASKWkeKFhFzXDFhQMYMhr1hFwDQCcDOUZFbMj0m7hNBDxGLOplB7RgWCRAQENZt/YHtbGMX2BAe148vbeeoqC3Q184OlgmLQBiZQNSzhS0eYsDSCeb5MGND6cRFBRHlAGAofjnhalNeJrUeEroLBIDoDBXWBUdFEJUGQWp2bP0NREStASAkI0CW4r0XTNRj5rwFAAFAoDVXmwAgshmhyZAwxzqTQ2Tqszw24o9t2l2uewIcomg+a/4BI7UR2maDnVtm4zexETYbJLSImCVzyIkoPzw8tO26RNcuYKwlg4QZImaYChuUMjm12poCNm15g+ZbGYCAHekY1foHNn1D/L+aPrNpHomKlO7TAIBFxIwIM2a21lrTLsp0AUDLc/dqUTOhsSlgGxDotPVuM4COEiG2hIfNLbL7jFH7V0IAQopHZ4QohzGGG/TfOA6vQKAlEOu1vPVIrFuClsBdr9ffw/YJdSMWQIQ1++/aKTa+GDEmXQEYARmAGHizLkkdOUKkmI5YfrCp2I8rNmCHoCt81vxABxu2s+P+3C52X0BI4QQDtz+CbQBgvFneBv3kipvec6V1CAJ9WKMPyp8OUvfjpiGEzRij/aEJgIKIKKgoaDuLop8kvq5Tepn56TjldZnAx77fcXdr5XZVFQFRAN6Qx7S+RgFAgkJQhQCylliUeAOrxNWmOldprFq72HBoS3pra+9vJUGa39UWfO11t/QxoQyxvgAAAWpZ/ELa2WLTFh4AAogGUPUaS1UhrQRC4x6hpc2Gs9g43KStTes9TB/IBHVca4MVQVptn3UyHQAk5gjVq6gTEKcqzrtlEbUTgGVzggvOiUiVanRVA4jlb9xH35Xnbnhz0JVJJGao6hoW25IgbYDuMQ1NDBAAiHVG0EpFq6BS3cKtb+cH2yYQAXCu0hAWolKq6iIB4VU1RKWrqip23XQtWLysAF3b1mqrXzOELgC2AbK+msUUFVX1oupAdSGipaiWwYVqcjJxjU6TrQxw8/l84Xd3SwkyT7X6BZA6VQ21Y0w/CqqrFHY0g6jplZ0IaNPXag3KWshwb0I00Xs7KCpNBEKkviwkVZglhLlzruwqoVPLBwQAcCcnJwvn3SxImInKTEXnEpngRCRIrNt9lMZUFFQlJjZElk5ENf2dlqounzfXA7+1qqcFEVlWlkVkJiIzH/ysAcDDDACA0lVuLiFMNeidsEw1FicrIvIqYhRRN7S/RlNZ7rIiKQBqOchtSdEmE7aDsgRHRURFREQlqKoT1VJEZyoy9SHcBR+ml5eX8w4ANnyAJAAW8/l82u8Pbq31Nyx8GyRMSWmuqoWIWiLlmKHFNTMQESCiKDTpZqBxT+ID4GG6twBJm0GqJktsr1GRmUi48yI3IYRb59x0Mpl0AQDUtQsAQPnmzZuZc9Vt8P4mhHAjIrciMpMQSlVxIhJUVURENWpgReUl/ddp3qR6UxCR+r1ujUstuOja/0+rfvi0c6VeArkOwV97567v7spmB0noMoEmCD59cDabzW6zLL8yNlyGEPaIaESEPRTJsU6OQKzZUeNmSQQk5fe6tF+f99ssuN8RRv8hDe3X1FdVLyKViMyDyF0QuQ4hXHnnr6qqunnz5rjdL7BsmqBW40ATgPnx8eWtc9W18/4yhHApQa5CSEyIP+iT9YnULAhhQ9Mbjk42r20sbX9HZEpilUa5VUQkiIgTkbmI3IlPbTTeXzjnLmazWbNrpBkIQRcDtOEI5wCTu+l0/8pau2OId4hpgAF7iJTXeYKUHDDL4yURisg9pS5IMQLcG+93275AtLil4wsi4kIIZeoeuQ4SLoL3586587KqLo+Pj28a9QD/UG2wfZSkt2/f8jd/+hNbYywjWYhpJlPX5ht5g41cyLaTizbjBNi2dW46vqTzWngfQqh7Cu9S28x77927qnKnZVW++3B1/f6Xn3++TJ1kdfOUNHuGlgD88MMP8OrVq66yEz178oSyImMiNtzo1IDY6kbrIGjz+NxVAq737Xv29VYMIJqOdBJ3PZUQQqhiM2W4CyFchRDOvfe/OudOF4vF2d3t3a//9fe/f2h0jzXtf1ke7+oP2Ego/PLLL/D1H75Gaw2vta0kwXE9y1KHyG0gNw45m5pv2X0Uetk1ldxNSP6nDCFMQwhX3vtz7/2v3rvTxcKdzmazd3/729/OU8PUNGnft7W/AUCDBRun7bdv3+Ifv/63uuxdt33QlhmAhsC6pPna+9qgfyNCTHRPB1pRXWpeQtrqFrXD8yFchiR81Hx1Wpbzs9OL0/dnv5zV1C+bpfF2p9hGj9AWEAAA9MeffoJvvvlGOXV7NAweoTPDq0s5oXmA2MqA5fYGDUdXb3MuCT8TkdsQ/GWT9tVicTqfz9+dn5+///7k+4sk/Hwb9bcC0DKF9hSH/Pjjj5pAECRaDTEoaqzXLlMZUh/a66AN1k9tqwsrhq+IvtJ4ley97hi99iFc+ODfe+/fOefOqqo6nc9nZ+fXH347+cdJl93LtmbJTgDuMYUahPD1118HIoonK8SAAEEV/CoLo6KgITnvsGp+jMK2/pZ0kAki6lOkWYnIIm1xdyGEW+9Tl6j3773z76qqOquq8nQ+L88+fPjw/uQfJxct4f026t8LQAcI7ZGW8NNPP4WXL196IvCq6ADUQUxAxCXqFMCpqgMAL7LMMHmNmg0i6uISJyIuneIWjZPcNIRwE728XIQQzr1zv4bgzypXnS0W5dl8Xr47PT09//777y86+oVlG/U/p1m6ORhRpGbpncPDw939/f2DoigOsix7ZIzZZ+Z9Zt5l4h2i1CofS1Sx0oRoGp1dAOt9wjGTszzP60yC3AXxNyHItfPuwrtwUVbzD9Pb6UXqGL/u6Bj/qNmBz2mX58Z0SN01Pnr97etRvxjs5Vm2Z43dY2t2mXnERENC7CNRj5ByJMgA0CAgA9aHsUZzU90uL1pKnBm4C0HuvA/Xwftr593VbDG7ujn77epkMrlJgk9bwxMfPTjxOQMT7db5BhDjnW+/fbxT5MWOzezIGDNk5iETD4gpltkJcwSyiMtOjWU6btkhrroIIQ5MSJBp8O6u8v7WufLm8u7m9uTNST0jMGuM0bTniOCLDUzcMy/UHJIq0uoDQP/o9dFgWAz7bO3AMPUMmx4SFYSUEYFFRKOAGCvfdYs8+NQZvvAhlEFkHhZutnCL2fn53XQyOZk1xmXK1mzAZ80N/Z6hKdwCRNYcnIIxFEc7R3me57m1NqfU6EwUu8viEVQEBEQk+BDABecqF9zicj5fTE5OmsNSZWuCbKMh+lMnxz57brBlEtiouzeHqWpAmqN0BgDMeDymoiioLMtYkZqAAEzqhIy7Z7X7fz9rWuxfMTiJHazgjoFJbk2PbhZmNld7aHKtxPU/Pjj5kUBsG6HFlvDQAYJC98jsF58h/lcNT0PH4ei+wek2CLBl6uOLD0//NxKXqwa3BaHgAAAAAElFTkSuQmCC";
const SNAPSHOT = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 90%22><text x=%220.18em%22 y=%221.1em%22 font-size=%2260%22 style="filter: grayscale(); opacity: 0.13;">❌</text></svg>';
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
const COL_RED = '#FF0000';

const PI2 = Math.PI * 2;
const PIH = Math.PI / 2;
const FPS = 1000 / 60;
const FPS_TOOLMOVE = 1000 / 50;

const MAXAMOUNT = 512000;
const MAXAMOUNTBOX = 128000;
const MAX_Z = 2000;
const GROUND_SIZE = 2500;
const WORKPLANE_SIZE = 120;
const WORKPLANE_VISIBILITY = 0.2;
const DEF_BGCOLOR = document.getElementById('input-env-background').value.toUpperCase();
const DEF_LIGHTCOLOR = document.getElementById('input-light-color').value.toUpperCase();

let MODE = 0; // model|render|export
let isRendering = true;
let isRenderAxisView = true;
let currentColor = document.getElementById('input-color').value.toUpperCase();
let currentColorBake = document.getElementById('input-material-albedo').value.toUpperCase();
let azimuth = null;
const viewAxes = [];

const canvas = document.getElementById('canvas_render');
const canvasPalette = document.getElementById('canvas_palette');

const workplaneWhiteList = [
    'add',
    'box_add', 'box_rem', 'box_paint',
    'transform_box', 'transform_rect',
    'rect_add', 'rect_remove', 'rect_paint'
];

const bvhWhiteList = [
    'rect_add'
];


// -------------------------------------------------------
// Initialize


const isMobile = isMobileDevice();

const engine = new BABYLON.Engine(canvas, true, {});
engine.disablePerformanceMonitorInBackground = true;
engine.preserveDrawingBuffer = false;
engine.premultipliedAlpha = false;
engine.enableOfflineSupport = false;
engine.doNotHandleContextLost = true;
engine.loadingScreen = new CustomLoadingScreen();
engine.displayLoadingUI();

const preferences = new Preferences();

const camera = new Camera();
const scene = createScene(engine);
camera.init(scene);
const sceneAxisView = createAxisViewScene(engine, scene);
const light = new Light(scene);

const renderPickTarget = new BABYLON.RenderTargetTexture('picktex', { useSRGBBuffer: false, delayAllocation: true, noColorAttachment: true, width: engine.getRenderWidth(), height: engine.getRenderHeight() }, scene, true);
scene.customRenderTargets.push(renderPickTarget);

const ui = new UserInterface(scene);
const uix = new UserInterfaceAdvanced(scene);

const hdri = new HDRI(scene);
const material = new Material(scene);

const builder = new Builder(scene);
const xformer = new Transformers();
const ghost = new Ghosts(scene);
const bakery = new Bakery(scene);

const palette = new Palette();
const helper = new Helper(scene, sceneAxisView);
const symmetry = new Symmetry();

const tool = new Tool(scene);

const project = new Project(scene);
const snapshot = new Snapshot(scene);
const memory = new Memory();

const generator = new Generator();
const voxelizer = new Voxelizer(scene);

const client = new WebsocketClient();


// startup
scene.executeOnceBeforeRender(() => {
    preferences.init();
});

scene.executeWhenReady(() => {
    preferences.finish();
});


// -------------------------------------------------------
// Render Loops


engine.runRenderLoop(() => {
    if (isRendering)
        scene.render();
});

scene.registerAfterRender(() => {
    if (isRendering) {
        if (isRenderAxisView) {
            sceneAxisView.render();
            sceneAxisView.activeCamera.alpha = scene.activeCamera.alpha;
            sceneAxisView.activeCamera.beta = scene.activeCamera.beta;
        }
        
        if (MODE == 0 && !tool.isMouseDown)
            camera.lastPos = [ camera.camera0.alpha, camera.camera0.beta ];
        
        if (scene.activeCamera.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA)
            camera.setOrthoMode();

        ui.updateStatus();
    }
});

renderPickTarget.onBeforeRender = () => {
    if (isRendering)
        if (MODE == 0 && tool.name !== 'camera')
            builder.mesh.thinInstanceSetBuffer("color", builder.rttColors, 4, true);
}

renderPickTarget.onAfterRender = () => {
    if (isRendering)
        if (MODE == 0 && tool.name !== 'camera')
            builder.mesh.thinInstanceSetBuffer("color", builder.bufferColors, 4, true);
}


// -------------------------------------------------------
// Scene


function createScene(engine) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
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
    shadowcatcher.convertToUnIndexedMesh();
    shadowcatcher.freezeWorldMatrix();
    shadowcatcher.freezeNormals();

    return scene;
}

function createAxisViewScene(engine, mainScene) {
    const scene = new BABYLON.Scene(engine);
    scene.autoClear = false;
    scene.autoClearDepthAndStencil = true;
    scene.blockMaterialDirtyMechanism = true;
    scene.useRightHandedSystem = true;

    const ambient = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 0, -1), scene);
    ambient.diffuse = new BABYLON.Color3(1, 1, 1);
    ambient.groundColor = new BABYLON.Color3(1, 1, 1);
    ambient.intensity = 1;

    const cam = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    cam.viewport = updateViewport(100, 100, 5, -5);
    cam.radius = 5.2;
    cam.fov = 0.5;
    cam.alpha = engine.scenes[0].activeCamera.alpha;
    cam.beta = engine.scenes[0].activeCamera.beta;

    const cube = BABYLON.MeshBuilder.CreateBox("viewcube", { size: 0.5 }, scene);
    cube.material = new BABYLON.NormalMaterial("viewcube", scene);
    cube.material.backFaceCulling = true;
    cube.material.freeze();
    cube.doNotSyncBoundingInfo = true;
    cube.doNotSerialize = true;
    cube.convertToUnIndexedMesh();
    cube.freezeWorldMatrix();
    cube.freezeNormals();

    const axisHelper = new BABYLON.AxesViewer(scene, 0.6, 0, null,null,null, 6);
    axisHelper.xAxis.getScene().materials[1].emissiveColor = COL_AXIS_X_RGB;
    axisHelper.yAxis.getScene().materials[2].emissiveColor = COL_AXIS_Y_RGB;
    axisHelper.yAxis.getScene().materials[3].emissiveColor = COL_AXIS_Z_RGB;
    axisHelper.xAxis.parent = cube;
    axisHelper.yAxis.parent = cube;
    axisHelper.zAxis.parent = cube;

    const axis = BABYLON.MeshBuilder.CreateSphere("viewaxes", { diameter: 0.55, segments: 5 }, scene);
    for (let i = 0; i < 6; i++) {
        const a = axis.clone();
        a.renderOverlay = true;
        a.renderOutline = true;
        a.outlineWidth = 0.04;
        a.overlayAlpha = 0.9;
        a.doNotSyncBoundingInfo = true;
        a.doNotSerialize = true;
        a.convertToUnIndexedMesh();
        a.freezeNormals();
        viewAxes.push(a);
    }
    axis.dispose();

    viewAxes[0].position.x = 0.85;
    viewAxes[0].renderOutline = false;
    viewAxes[0].overlayColor = COL_AXIS_X_RGB;
    viewAxes[1].position.x = -0.85;
    viewAxes[1].scaling.scaleInPlace(-0.9); // exclude border size
    viewAxes[1].overlayAlpha = 0.3;
    viewAxes[1].visibility = 0.01;
    viewAxes[1].overlayColor = viewAxes[0].overlayColor;
    viewAxes[1].outlineColor = viewAxes[0].overlayColor;
    viewAxes[2].position.y = 0.85;
    viewAxes[2].renderOutline = false;
    viewAxes[2].overlayColor = COL_AXIS_Y_RGB;
    viewAxes[3].position.y = -0.85;
    viewAxes[3].scaling.scaleInPlace(-0.9);
    viewAxes[3].overlayAlpha = 0.3;
    viewAxes[3].visibility = 0.01;
    viewAxes[3].overlayColor = viewAxes[2].overlayColor;
    viewAxes[3].outlineColor = viewAxes[2].overlayColor;
    viewAxes[4].position.z = 0.85;
    viewAxes[4].renderOutline = false;
    viewAxes[4].overlayColor = COL_AXIS_Z_RGB;
    viewAxes[5].position.z = -0.85;
    viewAxes[5].scaling.scaleInPlace(-0.9);
    viewAxes[5].overlayAlpha = 0.3;
    viewAxes[5].visibility = 0.01;
    viewAxes[5].overlayColor = viewAxes[4].overlayColor;
    viewAxes[5].outlineColor = viewAxes[4].overlayColor;

    const predicate = (mesh) => {
        return viewAxes.includes(mesh) || mesh == cube;
    };

    scene.onPointerObservable.add((pInfo) => {
        if (pInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
            const pick = scene.pick(scene.pointerX, scene.pointerY, predicate);
            if (pick.hit) {
                if (pick.pickedMesh == cube) {
                    if (MODE == 2) { // solved picking conflict for camera.frame() (deselected bake)
                        bakery.selected = bakery.lastSelected;
                        bakery.lastSelected = null;
                    }
                    camera.frame();
                } else {
                    if (pick.pickedMesh == viewAxes[0]) camera.setView('x');
                    if (pick.pickedMesh == viewAxes[1]) camera.setView('-x');
                    if (pick.pickedMesh == viewAxes[2]) camera.setView('y');
                    if (pick.pickedMesh == viewAxes[3]) camera.setView('-y');
                    if (pick.pickedMesh == viewAxes[4]) camera.setView('z');
                    if (pick.pickedMesh == viewAxes[5]) camera.setView('-z');
                    mainScene.activeCamera.detachControl(canvas);
                    setTimeout(() => { // solved mainScene rotation conflict
                        mainScene.activeCamera.attachControl(canvas, true);
                    }, 100);
                }
            }
        }
    });

    return scene;
}


// -------------------------------------------------------
// Camera


function Camera() {
    this.camera0 = null;    // model
    this.camera1 = null;    // bake
    this.lastPos = [];

    this.init = function(scene) {
        this.camera0 = new BABYLON.ArcRotateCamera("camera_model", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
        this.camera1 = new BABYLON.ArcRotateCamera("camera_bake", 0, 0, 10, BABYLON.Vector3.Zero(), scene);

        const fov = parseFloat(document.getElementById('input-camera-fov').value);

        this.camera0.setPosition(new BABYLON.Vector3(100, 100, 100));
        this.camera0.setTarget(BABYLON.Vector3.Zero());
        this.camera0.lowerRadiusLimit = 1;
        this.camera0.upperRadiusLimit = 1500;
        this.camera0.lowerBetaLimit = 0.0001; // fix the ortho Y inaccuracy
        this.camera0.upperBetaLimit = Math.PI - 0.0001;
        this.camera0.wheelPrecision = 3; //def: 3
        this.camera0.pinchPrecision = 30; //def: 12
        this.camera0.panningSensibility = 300; //def: 1000
        this.camera0.inertia = 0.9; //def: 0.9
        this.camera0.minZ = 0.1;
        this.camera0.maxZ = MAX_Z;
        this.camera0.fov = fov; //def: 0.8

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
        this.camera1.minZ = 0.1;
        this.camera1.maxZ = MAX_Z;
        this.camera1.fov = fov;
    }

    this.switchCamera = function() {
        scene.activeCamera.detachControl(canvas);
        if (MODE == 0) {
            scene.activeCamera = this.camera0;
            this.camera0.attachControl(canvas, true);
        } else if (MODE == 1) {
            scene.activeCamera = this.camera0;
            this.camera0.attachControl(canvas, true);
        } else if (MODE == 2) {
            scene.activeCamera = this.camera1;
            this.camera1.attachControl(canvas, true);
        }
        ui.domCameraFov.value = scene.activeCamera.fov;
    }

    this.frame = function() {
        if (MODE == 0) {
            this.setFramingBehavior(this.camera0, builder.mesh);
        } else if (MODE == 1) {
            window.pt.frameCamera();
        } else if (MODE == 2) {
            if (bakery.meshes.length > 0) {
                if (bakery.selected) { // zoom to selected mesh
                    this.setFramingBehavior(this.camera1, bakery.selected);
                } else {
                    this.setFramingBehavior(this.camera1, builder.mesh);
                }
            } else {
                this.setFramingBehavior(this.camera1, builder.mesh);
            }
        }
    }

    this.setFramingBehavior = function(cam, mesh) {
        const f = this.getFramed(mesh);
        animator(cam, 'radius', cam.radius, f.radius);
        animator(cam, 'target', cam.target.clone(), f.target);
    }

    this.getFramed = function(mesh, offset = 60) {
        if (!mesh) return;
        mesh.computeWorldMatrix(true);
        const bounds = mesh.getBoundingInfo();

        const bbox = bounds.boundingBox;
        const radiusWorld = bbox.maximumWorld.subtract(bbox.minimumWorld).scale(0.5);
        const centerWorld = bbox.minimumWorld.add(radiusWorld);
        const radius = (bounds.boundingSphere.radiusWorld + offset) / scene.activeCamera.fov;

        return { radius: radius, target: centerWorld };
    }

    this.toggleCameraAutoRotation = function() {
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

    this.updateCameraAutoRotation = function() {
        if (scene.activeCamera.useAutoRotationBehavior) {
            (ui.domAutoRotationCCW.checked) ?
                scene.activeCamera.autoRotationBehavior.idleRotationSpeed = -0.1 :
                scene.activeCamera.autoRotationBehavior.idleRotationSpeed = 0.1;
        }
    }

    this.switchOrtho = function() {
        if (scene.activeCamera.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
            this.setView('persp');
            if (MODE == 0)
                ui.domInScreenOrtho.innerHTML = 'P';
        } else {
            this.setView('ortho');
            if (MODE == 0)
                ui.domInScreenOrtho.innerHTML = 'O';
        }
    }

    this.setView = function(name) {
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

    this.setOrthoMode = function() {
        const size = scene.activeCamera.radius / 2;
        const sizeY = size * scene.activeCamera.fov;
        const sizeX = sizeY * scene.getEngine().getAspectRatio(scene.activeCamera);
        scene.activeCamera.orthoLeft = -sizeX;
        scene.activeCamera.orthoRight = sizeX;
        scene.activeCamera.orthoTop = sizeY;
        scene.activeCamera.orthoBottom = -sizeY;
    }

    this.setFov = function(value) {
        const fov = parseFloat(value);
        scene.activeCamera.fov = fov;
    }

    this.isCameraChange = function() {
        return (this.lastPos[0] !== this.camera0.alpha &&
                this.lastPos[1] !== this.camera0.beta)
    }
}


// -------------------------------------------------------
// Light


function Light(scene) {
    this.location = new BABYLON.Vector3(50, 100, 50);
    this.angle = 70;
    this.directional = null;

    this.init = function() {
        this.directional = new BABYLON.DirectionalLight("directional", new BABYLON.Vector3(0, 0, -1), scene);
        this.directional.position.copyFrom(this.location);
        this.directional.autoUpdateExtends = true; // to REFRESHRATE_RENDER_ONCE
        this.directional.diffuse = BABYLON.Color3.FromHexString(document.getElementById('input-light-color').value);
        this.directional.intensity = document.getElementById('input-light-intensity').value;
        this.directional.shadowMaxZ = 2500;
        this.directional.shadowMinZ = -2500;
        this.directional.setDirectionToTarget(BABYLON.Vector3.Zero());
        setLightPositionByAngle(this.angle, this.location.x);
        scene.getNodeByName("shadowcatcher").material.activeLight = this.directional;

        const shadowGen = new BABYLON.ShadowGenerator(isMobile ? 512 : 1024, this.directional);
        shadowGen.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        shadowGen.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM;
        shadowGen.useExponentialShadowMap = true; // def: true
        shadowGen.usePercentageCloserFiltering = true; // webgl2 only, fallback -> usePoissonSampling
        shadowGen.forceBackFacesOnly = false;
        shadowGen.bias = 0.00001; // def: 0.00005
        shadowGen.setDarkness(0);
    }

    this.updateShadowMap = function() {
        this.directional.getShadowGenerator().getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        material.updateCelMaterial();
    }
    
    this.updateAngle = function(angle) {
        setLightPositionByAngle(angle, this.location.x);
        this.updateShadowMap();
    }
    
    this.updateHeight = function(posY) {
        this.directional.position.y = posY;
        this.directional.setDirectionToTarget(BABYLON.Vector3.Zero());
        this.updateShadowMap();
    }
    
    this.updateIntensity = function(value) {
        this.directional.intensity = value;
        material.updateCelMaterial();
    }
    
    this.updateColor = function(hex) {
        this.directional.diffuse = BABYLON.Color3.FromHexString(hex).toLinearSpace();
        material.updateCelMaterial();
    }
    
    this.getDirection = function() {
        return this.directional.direction;
    }
    
    this.enableShadows = function(isEnabled) {
        scene.getNodeByName("shadowcatcher").isVisible = isEnabled;
        this.directional.shadowEnabled = isEnabled;
        if (MODE == 0) builder.create();
    }

    this.addMesh = function(mesh) {
        this.directional.getShadowGenerator().addShadowCaster(mesh);
    }

    function setLightPositionByAngle(angle, dist) {
        scene.lights[1].position.x = Math.cos(angle * Math.PI / 180) * dist;
        scene.lights[1].position.z = Math.sin(angle * Math.PI / 180) * dist;
        scene.lights[1].setDirectionToTarget(BABYLON.Vector3.Zero());
    }

    this.init();
}


// -------------------------------------------------------
// HDRI and Skybox


function HDRI(scene) {
    this.hdrMap = null;
    this.skybox = null;
    this.isLoaded = false;

    this.init = function() {
        this.hdrMap = new BABYLON.HDRCubeTexture(ENVMAP, scene, 512, undefined,undefined,undefined,undefined, () => {
            hdri.hdrMap.gammaSpace = false;
            hdri.skybox = hdri.createSkybox(hdri.hdrMap.clone(), parseFloat(ui.domHdriBlur.value));
            scene.environmentTexture = hdri.hdrMap;
        });
    }

    this.loadHDR = function(url) {
        if (window.pt)
            window.pt.updateHDR(url);

        if (this.hdrMap)
            this.hdrMap.dispose();

        this.hdrMap = new BABYLON.HDRCubeTexture(url, scene, 512, undefined,undefined,undefined,undefined, () => {
            hdri.hdrMap.gammaSpace = false;
            if (hdri.skybox.material.reflectionTexture)
                hdri.skybox.material.reflectionTexture.dispose();
            hdri.skybox.material.reflectionTexture = hdri.hdrMap.clone();
            hdri.skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            hdri.skybox.isVisible = ui.domHdriToggle.checked;
            scene.environmentTexture = hdri.hdrMap;
            
            bakery.updateReflectionTextures();

            hdri.isLoaded = true;
        });
    }

    this.unloadHDR = function() {
        this.loadHDR(ENVMAP);
    }

    this.createSkybox = function(tex, blur) {
        const dist = 10000; //(scene.activeCamera.maxZ - scene.activeCamera.minZ) / 2;
        const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: dist }, scene);
        skybox.material = new BABYLON.PBRMaterial("skybox", scene);
        skybox.material.reflectionTexture = tex;
        skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skybox.material.microSurface = 1.0 - blur;
        skybox.material.disableLighting = true;
        skybox.material.twoSidedLighting = true;
        skybox.material.backFaceCulling = false;
        skybox.isPickable = false;
        skybox.isVisible = false;
        skybox.infiniteDistance = true;
        skybox.ignoreCameraMaxZ = true;
        skybox.rotation.y = -Math.PI / 2;
        skybox.doNotSyncBoundingInfo = true;
        skybox.convertToUnIndexedMesh();
        skybox.freezeWorldMatrix();
        skybox.freezeNormals();
        return skybox;
    }

    this.toggleSkybox = function(isShow) {
        if (this.skybox) this.skybox.isVisible = isShow;
    }

    this.setBlurAmount = function(num) {
        this.skybox.material.microSurface = 1.0 - num;
    }

    this.init();
}


// -------------------------------------------------------
// Material


function Material(scene) {
    this.mode = 'CEL';
    this.mat_cel = null;
    this.mat_std = null;
    this.mat_pbr = null;
    this.mat_pbr_v = null;
    this.mat_workplane = null;
    this.mat_grid = null;
    this.mat_white = null;
    this.tex_pbr = null;
    this.textures = [];
    this.texId = 0; // current PBR texture

    this.init = function() {
        for (let i = 0; i < TEX_PATTERNS.length; i++) // load pattern textures
            this.textures.push(this.createTexture('texpat'+i, TEX_PATTERNS[i], BABYLON.Texture.LINEAR_LINEAR_MIPLINEAR));

        for (let i = 0; i < TEX_PRESETS.length; i++)
            this.addTexture(TEX_PRESETS[i]); // import texture samples

        this.texId = 3; // checker
        this.tex_pbr = this.textures[this.texId];

        this.createCelMaterial();
        this.createPBRMaterialVoxels();
        this.createPBRMaterial(true);
        this.createSTDMaterial();

        this.createWorkplaneMaterial();
        this.createGridMaterial();
        this.createWhiteMaterial();
    }

    this.createSTDMaterial = function() {
        const mat = new BABYLON.StandardMaterial("STD", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        mat.specularColor = new BABYLON.Color3(0, 0, 0);
        mat.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        mat.useEmissiveAsIllumination = false;
        mat.linkEmissiveWithDiffuse = true;
        mat.backFaceCulling = true;
        mat.transparencyMode = 0;
        mat.checkReadyOnEveryCall = false;
        this.mat_std = mat;
    }

    this.createPBRMaterialVoxels = function() {
        const tex = this.createVoxelTexture();
        const mat = new BABYLON.PBRMaterial("PBR_V", scene);
        mat.albedoColor = new BABYLON.Color3(1, 1, 1);
        mat.albedoTexture = tex;
        mat.roughness = 0.8;
        mat.metallic = 0.4;
        mat.alpha = 1;
        mat.alphaCutOff = 0.5;
        mat.alphaMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
        mat.transparencyMode = 1;
        mat.useAlphaFromAlbedoTexture = true;
        mat.backFaceCulling = true;
        mat.specularIntensity = 1;
        mat.directIntensity = 1;
        mat.environmentIntensity = 1;
        this.mat_pbr_v = mat;
    }

    this.createPBRMaterial = function(backFaceCulling = true) {
        if (this.mat_pbr) {
            this.mat_pbr.albedoTexture.dispose();
            this.mat_pbr.reflectionTexture.dispose();
            this.mat_pbr.dispose();
        }
        const mat = new BABYLON.PBRMaterial("PBR", scene);
        mat.albedoColor = new BABYLON.Color3(1, 1, 1);
        mat.albedoTexture = this.tex_pbr.clone();
        mat.reflectionTexture = hdri.hdrMap.clone();
        mat.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
        mat.roughness = 0.8;
        mat.metallic = 0.4;
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

    this.createWorkplaneMaterial = function() {
        const mat = new BABYLON.GridMaterial("workplane", scene);
        mat.gridRatio = 1;
        mat.majorUnitFrequency = 20;
        mat.minorUnitVisibility = 0.4;
        mat.mainColor = new BABYLON.Color3(0, 1, 1);
        mat.lineColor = new BABYLON.Color3(0, 1, 1);
        mat.opacity = 0.8;
        mat.backFaceCulling = false;
        mat.freeze();
        this.mat_workplane = mat;
    }

    this.createGridMaterial = function() {
        const mat = new BABYLON.GridMaterial("grid", scene);
        mat.opacityTexture = new BABYLON.Texture(PARTICLE, scene, undefined, undefined, BABYLON.Texture.LINEAR_LINEAR);
        mat.opacityTexture.optimizeUVAllocation = true;
        mat.gridRatio = 0; // overrided by setGrid()
        mat.majorUnitFrequency = 40;
        mat.minorUnitVisibility = 0.25;
        mat.mainColor = new BABYLON.Color3(1,1,1);
        mat.lineColor = new BABYLON.Color3(1,1,1);
        mat.opacity = 0.05;
        mat.backFaceCulling = false;
        this.mat_grid = mat;
    }

    this.createWhiteMaterial = function() {
        const mat = new BABYLON.StandardMaterial("white", scene);
        mat.disableLighting = true;
        mat.emissiveColor = BABYLON.Color3.White();
        mat.zOffset = -1;
        mat.freeze();
        this.mat_white = mat;
    }

    this.createVoxelTexture = function() {
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

    this.createTexture = function(name, url, sampling = BABYLON.Texture.NEAREST_SAMPLINGMODE) {
        const tex = new BABYLON.Texture(url, scene, undefined, undefined, sampling);
        tex.name = name;
        tex.uScale = 1;
        tex.vScale = 1;
        tex.hasAlpha = true;
        tex.gammaSpace = true;
        tex.optimizeUVAllocation = true;
        return tex;
    }

    this.setPBRTexture = function(idx = 3) {
        this.texId = idx;
        this.tex_pbr = this.textures[idx];
        this.createPBRMaterial(ui.domBakeryBackFace.checked);
    }

    this.addTexture = function(data) {
        this.textures.push(this.createTexture('texpbr_user', data));
        const idx = this.textures.length - 1;
        this.setPBRTexture(idx);
        const li = document.createElement("li");
        li.classList.add("img");
        li.innerHTML = `<img data-bind="${ idx }" src="${ data }">`;
        li.addEventListener("click", () => {
            for (const i of ui.domTexturePresets.children)  // unselect presets
                i.firstChild.style.borderColor = '#6b798d';
            li.firstChild.style.borderColor = COL_ORANGE;   // select preset

            material.setPBRTexture(idx);
            bakery.replaceTexture();
        }, false);
        ui.domTexturePresets.appendChild(li);
    }

    this.switchMaterial = function() {
        if (this.mode == 'CEL') {
            this.mode = 'PBR';
            builder.mesh.material = this.mat_pbr_v;
        } else if (this.mode == 'PBR') {
            this.mode = 'CEL';
            builder.mesh.material = this.mat_cel;
        }
        ui.domMaterialSwitch.firstChild.innerHTML = this.mode;
    }

    this.getMaterial = function() {
        if (this.mode == 'CEL') {
            return this.mat_cel;
        } else if (this.mode == 'PBR') {
            return this.mat_pbr_v;
        }
    }

    this.createCelMaterial = function() {
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
            varying float vDepth;

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
                vDepth = 1.0 + gl_Position.w;
            }
        `;

        BABYLON.Effect.ShadersStore['celFragmentShader'] = `
            precision highp float;

            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec2 vUv;
            varying vec4 vColor;
            varying float vDepth;

            uniform mat4 uCamMatrix;
            uniform vec3 uLightPos;
            uniform vec3 uLightCol;

            void main() {
                vec2 grid = abs(fract(vUv - 0.5) - 0.5) / fwidth(vUv);
                float line = min(grid.x, grid.y);
                if (any(greaterThan(vColor.rgb, vec3(0.217)))) {
                    line = 1.0 - min(line, 1.0);
                } else {
                    line = min(line, 1.0);
                }

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
                    amb *= 1.8;

                vec3 brdf = vec3(0);
                brdf += 0.5 * amb * vec3(1);
                brdf += 1.2 * dif * uLightCol;
                brdf += 0.4 * inv * uLightCol;
                brdf += 0.8 * spc * vec3(1);

                vec3 col = pow(vColor.rgb * vColor.rgb, vec3(0.4545));
                col = mix(col, vec3(0), line * 0.2);
                col *= brdf;
                col = pow(col, vec3(0.4545));

                gl_FragColor = vec4(col, 1.0);
            }
        `;

        this.mat_cel = new BABYLON.ShaderMaterial('CEL', scene, {
                vertex: "cel",
                fragment: "cel",
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

    this.updateCelMaterial = function() {
        if (this.mat_cel) {
            this.mat_cel.setMatrix("uCamMatrix", camera.camera0.getWorldMatrix());
            this.mat_cel.setVector3("uLightPos", light.directional.position);
            const lightCol = new BABYLON.Color3(
                light.directional.diffuse.r * light.directional.intensity,
                light.directional.diffuse.g * light.directional.intensity,
                light.directional.diffuse.b * light.directional.intensity
            );
            this.mat_cel.setColor3("uLightCol", lightCol);
            //this.mat_cel.setTexture("uTexture", this.textures[3]);
        }
    }

    this.init();
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


function Builder(scene) {
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
    let tMatrix = BABYLON.Matrix.Identity();

    this.rttColors = [];
    this.rttColorsMap = [];

    this.positionsMap = [];

    this.init = function() {
        this.voxel = BABYLON.MeshBuilder.CreateBox("voxel", { updatable: false }, scene);
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

    this.create = function() {
        if (this.voxels.length == 0)
            generator.newBox(1, currentColor);

        this.isWorking = true;
        this.createThinInstances(this.voxels);

        renderPickTarget.renderList = [ this.mesh ];
        renderPickTarget.setMaterialForRendering(this.mesh, material.mat_white);

        if (preferences.getBvhPicking()) {
            setTimeout(() => { // TODO: this causes a delay,
                window.rc.create(); // but we couldn't use a web worker
                builder.isWorking = false;
            });
        } else {
            setTimeout(() => {
                if (bvhWhiteList.includes(tool.name))
                    window.rc.create();
                builder.isWorking = false;
            });
        }

        light.addMesh(this.mesh);
        light.updateShadowMap();
        
        setTimeout(() => {
            palette.create();
            helper.setGrid();
            helper.setSymmPivot();

            if (preferences.getWebsocket())
                client.ws_send(this.voxels);
        }, 10);
    }

    this.createThinInstances = function(voxels) {
        this.bufferMatrix = new Float32Array(16 * voxels.length);
        this.bufferColors = new Float32Array(4 * voxels.length);
        this.rttColors = new Float32Array(4 * voxels.length);
        this.rttColorsMap = new Array(voxels.length);
        this.positionsMap = new Array(voxels.length);

        for (let i = 0; i < voxels.length; i++) {
            tMatrix = BABYLON.Matrix.Translation(
                voxels[i].position.x, voxels[i].position.y, voxels[i].position.z);
            if (!voxels[i].visible)
                tMatrix = tMatrix.multiply(BABYLON.Matrix.Scaling(0, 0, 0));
            tMatrix.copyToArray(this.bufferMatrix, i * 16);

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
        //this.mesh.thinInstanceRefreshBoundingInfo();

        this.bufferWorld = this.mesh.thinInstanceGetWorldMatrices();
        this.bufferMatrix = [];
    }

    this.fillArrayBuffers = function() { // for raycaster, pathtracer and export
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

    this.createMesh = function() { // for export only
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

    this.getCenter = function() {
        return this.mesh.getBoundingInfo().boundingSphere.centerWorld;
    }

    this.getRadius = function() {
        return this.mesh.getBoundingInfo().boundingSphere.radius;
    }

    this.getIndexAtPointer = function() { // GPU color-picking method
        const x = Math.round(scene.pointerX); // by @kikoshoung
        const y = engine.getRenderHeight() - Math.round(scene.pointerY);
        const pixels = readTexturePixels(engine._gl, renderPickTarget._texture._hardwareTexture.underlyingResource, x, y, 1, 1);
        const colorId = `${pixels[0]}_${pixels[1]}_${pixels[2]}`;        
        if (this.bufferWorld[this.rttColorsMap[colorId]])
            return this.rttColorsMap[colorId];
        return -1;
    }

    this.getIndexAtPosition = function(pos) { // return undefined
        return this.positionsMap[`${pos.x}_${pos.y}_${pos.z}`];
    }

    this.getIndexAtXYZ = function(x, y, z) {
        return this.positionsMap[`${x}_${y}_${z}`];
    }

    this.getVoxelAtPosition = function(pos) {
        const idx = this.getIndexAtPosition(pos);
        if (idx > -1)
            return this.voxels[idx];
        return null;
    }

    this.getVoxelAtXYZ = function(x, y, z) {
        const idx = this.getIndexAtXYZ(x, y, z);
        if (idx > -1)
            return this.voxels[idx];
        return null;
    }

    this.getVoxelsByPosition = function(pos) { // dup
        return this.voxels.filter(i =>
            i.position.x === pos.x &&
            i.position.y === pos.y &&
            i.position.z === pos.z);
    }

    this.getVoxelsByColor = function(hex) { // dup
        return this.voxels.filter(i => i.color === hex);
    }

    this.getVoxelsByVisibility = function(isVisible) { // dup
        return this.voxels.filter(i => i.visible === isVisible);
    }

    this.findIndexByPosition = function(pos) { // no dup
        return this.voxels.findIndex(i =>
            i.position.x == pos.x &&
            i.position.y == pos.y &&
            i.position.z == pos.z);
    }

    this.findIndexByColor = function(hex) { // no dup
        return this.voxels.findIndex(i => i.color === hex);
    }

    this.add = function(pos, hex, visible) {
        this.voxels.push({ position: pos, color: hex, visible: visible });
    }

    this.addArray = function(arr) {
        this.voxels = this.voxels.concat(arr);
    }

    this.addNoDup = function(pos, hex, visible) {
        if (this.findIndexByPosition(pos) == -1)
            this.voxels.push({ position: pos, color: hex, visible: visible });
    }

    this.remove = function(voxel) {
        const idx = this.voxels.indexOf(voxel);
        if (idx > -1)
            this.voxels.splice(idx, 1);
    }

    this.removeByArray = function(arr) {
        this.voxels = this.voxels.filter(i => !arr.includes(i));
    }

    this.removeByPosition = function(pos) { // dup
        this.removeByArray(this.getVoxelsByPosition(pos));
    }

    this.paintByArray = function(arr, hex) {
        for (let i = 0; i < arr.length; i++)
            this.voxels[arr[i].idx].color = hex;
    }

    this.setMeshVisibility = function(isVisible) {
        this.mesh.isVisible = isVisible;
    }

    this.setVoxelsVisibility = function(isVisible) {
        for (let i = 0; i < this.voxels.length; i++)
            this.voxels[i].visible = isVisible;
    }

    this.setAllColorsAndUpdate = async function(hex = currentColor) {
        if (!await ui.showConfirm('replace all colors?')) return;
        for (let i = 0; i < this.voxels.length; i++) {
            this.voxels[i].visible = true;
            this.voxels[i].color = hex;
        }
        this.create();
        this.update();
    }

    this.setAllVisibilityAndUpdate = function(isVisible) {
        for (let i = 0; i < this.voxels.length; i++)
            this.voxels[i].visible = isVisible;
        this.create();
        this.update();
    }

    this.invertVisibilityAndUpdate = function() {
        const hiddens = this.getVoxelsByVisibility(false);
        if (hiddens.length == 0) return;

        for (let i = 0; i < this.voxels.length; i++)
            this.voxels[i].visible = !this.voxels[i].visible;
        this.create();
        this.update();
    }

    this.deleteColorAndUpdate = async function(hex) {
        const group = this.getVoxelsByColor(hex);
        if (group.length == 0) return;
        
        this.removeByArray(group);
        this.create();
        this.update();
    }

    this.deleteHiddenAndUpdate = async function() {
        const hiddens = this.getVoxelsByVisibility(false);

        if (hiddens.length == 0) return;
        if (!await ui.showConfirm('delete hidden voxels?')) return;
        
        this.removeByArray(hiddens);
        this.create();
        this.update();
    }

    this.reduceVoxels = async function() {
        if (!await ui.showConfirm('reducing voxels, continue?')) return;
        const last = this.voxels.length;

        window.worker.start('findInnerVoxels', [ this.voxels, this.positionsMap ], (data) => {
            this.voxels = [];
            for (let i = 0; i < data.length; i++) {
                this.add(new BABYLON.Vector3(
                    data[i].position._x, data[i].position._y, data[i].position._z),
                    data[i].color, true);
            }
            this.create();
            this.update();
            ui.notification(`${ last - this.voxels.length } voxels removed`);
        });
    }

    this.removeDuplicates = function() {
        const last = this.voxels.length;
        
        window.worker.start('findDuplicates', [ this.voxels, this.positionsMap ], (data) => {
            this.voxels = [];
            for (let i = 0; i < data.length; i++) {
                this.add(new BABYLON.Vector3(
                    data[i].position._x, data[i].position._y, data[i].position._z),
                    data[i].color, true);
            }
            this.create();
            this.update();
            ui.notification(`found ${ last - this.voxels.length } duplicates`);
        });
    }

    this.normalizeVoxelPositions = function(isRecordMem) {
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

    this.getData = function() {
        return JSON.stringify(this.voxels);
    }

    this.getDataString = function() {
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

    this.setData = function(data) {
        xformer.cancel();
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

    this.setDataFromString = function(data) {
        xformer.cancel();
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

    this.setDataFromArray = function(arr) {
        xformer.cancel();
        this.voxels = arr;
        this.create();
    }

    this.createArrayFromPositions = function(positions, isSymmetry) {
        const arr = [];
        let v;
        for (let i = 0; i < positions.length; i++) {
            v = this.getVoxelAtPosition(positions[i]);
            if (v) arr.push(v);

            if (isSymmetry) {
                v = this.getVoxelAtPosition(symmetry.invertPos(positions[i]));
                if (v) arr.push(v);
            }
        }
        return arr;
    }

    this.createArrayFromNewPositions = function(positions, hex, isSymmetry) {
        const arr = [];
        for (let i = 0; i < positions.length; i++) {
            this.add(positions[i], hex, true);

            if (isSymmetry)
                this.add(symmetry.invertPos(positions[i]), hex, true);
        }
        return arr;
    }

    this.update = function() {
        memory.record(this.getData());
    }

    this.init();
}


// -------------------------------------------------------
// Ghosts


function Ghosts(scene) {
    this.voxel = null;
    this.thin = null;
    this.sps = null;
    this.cloud = null;
    let bufferMatrix = [];
    let bufferColors = [];
    let tMatrix = BABYLON.Matrix.Identity();

    this.init = function() {
        this.voxel = BABYLON.MeshBuilder.CreateBox("ghostvoxel", { size: 1.01, updatable: false }, scene);
        this.voxel.isVisible = false;
        this.voxel.isPickable = false;
        this.voxel.receiveShadows = false;
        this.voxel.doNotSerialize = true;
        this.voxel.material = material.mat_std;
        this.voxel.freezeWorldMatrix();
        this.voxel.freezeNormals();

        this.disposeThin(); // init
    }

    this.createThin = function(voxels) {
        if (voxels.length == 0) return;

        if (this.thin)
            this.thin.dispose();

        bufferMatrix = new Float32Array(16 * voxels.length);
        bufferColors = new Float32Array(4 * voxels.length);

        for (let i = 0; i < voxels.length; i++) {
            tMatrix = BABYLON.Matrix.Translation(voxels[i].position.x, voxels[i].position.y, voxels[i].position.z);
            if (!voxels[i].visible)
                tMatrix = tMatrix.multiply(BABYLON.Matrix.Scaling(0, 0, 0));
            tMatrix.copyToArray(bufferMatrix, i * 16);
        }

        bufferColors.fill(1);
    
        this.thin = this.voxel.clone();
        this.thin.makeGeometryUnique();
        this.thin.thinInstanceSetBuffer("matrix", bufferMatrix, 16, true);
        this.thin.thinInstanceSetBuffer("color", bufferColors, 4, true);
        this.thin.isVisible = true;
        this.thin.material.diffuseColor = BABYLON.Color3.White();

        highlightOverlayMesh(this.thin, COL_ORANGE_RGB);
        highlightOutlineMesh(this.thin, COL_ORANGE_RGBA);

        light.addMesh(this.thin);
        light.updateShadowMap();

        bufferMatrix = [];
        bufferColors = [];
    }

    this.disposeThin = function() {
        if (xformer.isActive) return;

        if (this.thin)
            this.thin.dispose();

        this.thin = this.voxel.clone();
        this.thin.isVisible = false;
    }

    this.createSPS = function(voxels = builder.voxels) {
        if (voxels.length == 0) return;

        if (this.sps)
            this.sps.dispose();
        
        this.sps = new BABYLON.SolidParticleSystem('ghostsps', scene, { isPickable: true, updatable: false, expandable: false, boundingSphereOnly: true });
        this.sps.computeBoundingBox = false;

        this.sps.addShape(this.voxel, voxels.length, { positionFunction: (particle, i, s) => {
            particle.position.copyFrom(voxels[i].position);
            particle.color = BABYLON.Color4.FromHexString(voxels[i].color);
            if (!voxels[i].visible) particle.scaling.set(0,0,0);
        }});

        this.sps.initParticles();
        this.sps.buildMesh();
        this.sps.mesh.isPickable = true;
        this.sps.mesh.doNotSerialize = true;
        this.sps.mesh.freezeNormals();
    }

    this.disposeSPS = function() {
        if (this.sps)
            this.sps.dispose();
        this.sps = null;
    }

    this.createPointCloud = function(voxels = builder.voxels) {
        if (voxels.length == 0) return;

        if (this.cloud)
            this.cloud.dispose();
        
        this.cloud = new BABYLON.PointsCloudSystem('ghostcloud', 1, scene, { updatable: false });
        this.cloud.computeBoundingBox = false;

        const setParticles = function(particle, i, s) {
            particle.position.copyFrom(voxels[s].position);
            particle.position.x += 0.5 * Math.random() - 0.25;
            particle.position.y += 0.5 * Math.random() - 0.25;
            particle.position.z += 0.5 * Math.random() - 0.25;
            particle.color = COL_AQUA_RGBA;
        };

        this.cloud.addPoints(voxels.length, setParticles);
        this.cloud.addPoints(voxels.length, setParticles);
        this.cloud.addPoints(voxels.length, setParticles);
        this.cloud.buildMeshAsync().then((mesh) => {
            mesh.visibility = 0.2;
            mesh.isPickable = false;
            mesh.doNotSerialize = true;
            mesh.doNotSyncBoundingInfo = true;
            mesh.freezeWorldMatrix();
            mesh.freezeNormals();
        });
    }

    this.disposePointCloud = function() {
        if (this.cloud)
            this.cloud.dispose();
        this.cloud = null;
    }

    this.addThin = function(pos, hex) {
        this.thin.isVisible = true;
        this.thin.material.diffuseColor = BABYLON.Color3.FromHexString(hex);
        this.thin.thinInstanceAdd(BABYLON.Matrix.Translation(pos.x, pos.y, pos.z));
    }

    this.getCenter = function() {
        return this.thin.getBoundingInfo().boundingSphere.centerWorld;
    }

    this.getCenterFromArray = function(voxels) {
        this.createThin(voxels);
        const center = this.thin.getBoundingInfo().boundingSphere.centerWorld;
        this.disposeThin();
        return center;
    }

    this.init();
}


// -------------------------------------------------------
// Transformers


function Transformers() {
    this.root = new BABYLON.TransformNode('xformer');
    this.isActive = false;
    this.isTransform = false;
    this.isNewObject = false;
    let indexes = [];
    let origins = [];
    let startPos = null;
    let useCurrentColor = false;

    this.begin = function(voxels) {
        if (voxels.length == 0) return;
        origins = voxels;

        ghost.createThin(voxels);

        this.root.position.copyFrom(ghost.getCenter());
        ghost.thin.setParent(this.root);

        uix.bindVoxelGizmo(this.root);
        startPos = this.root.position.clone();

        indexes = [];
        for (let i = 0; i < voxels.length; i++) {
            const idx = voxels[i].idx;
            if (indexes.indexOf(idx) == -1) { // duplicates broke transform
                indexes.push(idx);
                if (!ui.domTransformClone.checked)
                    builder.voxels[idx].visible = false;
            }
        }

        if (!ui.domTransformClone.checked)
            builder.create();

        this.isActive = true;
        this.isTransform = true;
    }

    this.finish = function() {
        if (this.isTransform) {
            const p = this.root.position.subtract(startPos);

            if (!p.equals(BABYLON.Vector3.Zero())) { // change on move
                if (!ui.domTransformClone.checked) {
                    for (let i = 0; i < indexes.length; i++) {
                        builder.voxels[ indexes[i] ].position.addInPlace(p);
                        builder.voxels[ indexes[i] ].visible = true;
                    }
                } else {
                    for (let i = 0; i < indexes.length; i++) {
                        builder.add(builder.voxels[ indexes[i] ].position.add(p),
                                    builder.voxels[ indexes[i] ].color, true);
                    }
                }
            } else {
                if (!ui.domTransformClone.checked) {
                    for (let i = 0; i < indexes.length; i++)
                        builder.voxels[ indexes[i] ].visible = true;
                }
            }
        }
    }

    this.beginNewObject = function(voxels, useCurrentColor = true) {
        if (voxels.length == 0) return;
        origins = voxels;
        useCurrentColor = useCurrentColor;

        tool.toolSelector('camera');
        ghost.createThin(voxels);
        
        this.root.position.copyFrom(ghost.getCenter());
        ghost.thin.setParent(this.root);

        uix.bindVoxelGizmo(this.root);
        startPos = this.root.position.clone();

        this.isActive = true;
        this.isNewObject = true;
    }

    this.finishNewObject = function() {
        if (this.isNewObject) {
            const p = this.root.position.subtract(startPos);
            
            if (useCurrentColor) {
                for (let i = 0; i < origins.length; i++) {
                    origins[i].position.addInPlace(p);
                    builder.add(origins[i].position, currentColor, true);
                }
            } else {
                for (let i = 0; i < origins.length; i++) {
                    origins[i].position.addInPlace(p);
                    builder.add(origins[i].position, origins[i].color, true);
                }
            }
        }
    }

    this.apply = function() {
        if (this.isTransform || this.isNewObject) {
            this.finish();
            this.finishNewObject();
            
            this.isActive = false;
            this.isTransform = false;
            this.isNewObject = false;

            builder.create();
            builder.update();

            uix.unbindVoxelGizmo();
            ghost.thin.setParent(null);
            ghost.disposeThin();
            
            indexes = [];
            origins = [];
            useCurrentColor = false;
        }
    }

    this.cancel = function() {
        if (this.isTransform || this.isNewObject) {
            this.isActive = false;
            this.isTransform = false;
            this.isNewObject = false;

            builder.create();

            uix.unbindVoxelGizmo();
            ghost.thin.setParent(null);
            ghost.disposeThin();

            indexes = [];
            origins = [];
            useCurrentColor = false;
        }
    }
}


// -------------------------------------------------------
// Palette (color palette)


function Palette() {
    const W = 25;
    const H = 25;
    const pad = 2;
    const ctx = canvasPalette.getContext('2d', { willReadFrequently: true });
    this.uniqueColors = [];

    this.init = function() {
        canvasPalette.width = canvasPalette.clientWidth;
        canvasPalette.height = canvasPalette.clientHeight;
                
        canvasPalette.addEventListener("pointerdown", (ev) => {
            const hex = getCanvasColor(ctx, ev.offsetX, ev.offsetY);
            if (hex) {
                if (palette.uniqueColors.includes(hex)) {
                    if (ev.button == 2) {
                        palette.setColorVisible(hex, !palette.isColorVisible(hex));
                    } else {
                        currentColor = hex;
                        uix.colorPicker.value = BABYLON.Color3.FromHexString(hex);
                    }
                }
            }
        }, false);

        if (isMobile) {
            canvasPalette.addEventListener("dblclick", (ev) => {
                const hex = getCanvasColor(ctx, ev.offsetX, ev.offsetY);
                if (hex) {
                    if (palette.uniqueColors.includes(hex))
                        palette.setColorVisible(hex, !palette.isColorVisible(hex));
                }
            }, false);
        }

        new ResizeObserver((ev) => {
            palette.create();
        }).observe(canvasPalette);
    }

    this.create = function() { // dev note: I have tested this function in a webworker,
        const wPad = W + pad;  // no performance difference, it causes a refresh delay.
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
                    row += H + pad;
                }
            }
        }
    }

    this.expand = function(num) {
        ui.domPalette.style.width = 8 + ((W + pad) * num) + "px";
        canvasPalette.width = ui.domPalette.clientWidth;
    }
    
    this.addColor = function(x, y, hex) {
        ctx.strokeStyle = 'transparent';
        if (!this.isColorVisible(hex)) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'orange';
            ctx.strokeRect(x, y, W, H);
        }
        ctx.fillStyle = hex;
        ctx.fillRect(x, y, W, H);
    }

    this.setColorVisible = function(hex, isVisible) {
        const voxels = builder.getVoxelsByColor(hex);
        for (let i = 0; i < voxels.length; i++)
            builder.voxels[voxels[i].idx].visible = isVisible;
        builder.create();
        builder.update();
    }

    this.isColorVisible = function(hex) {
        const idx = builder.findIndexByColor(hex);
        if (idx > -1)
            return builder.voxels[ idx ].visible;
        return false;
    }

    this.init();
}


// -------------------------------------------------------
// Helper (overlays)


function Helper(scene, sceneAxisView) {
    this.gridPlane = BABYLON.MeshBuilder.CreatePlane("gridplane", { width: 3, height: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, scene);
    this.floorPlane = BABYLON.MeshBuilder.CreatePlane("floorplane", { size: 2500, sideOrientation: BABYLON.Mesh.BACKSIDE, updatable: false }, scene);
    this.workplane = BABYLON.MeshBuilder.CreatePlane("workplane", { size: WORKPLANE_SIZE, sideOrientation: BABYLON.Mesh.BACKSIDE, updatable: false }, scene);
    this.axisPlane = BABYLON.MeshBuilder.CreatePlane("axisplane", { width: 1.1, height: 1.1, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, sceneAxisView);
    this.overlayPlane = BABYLON.MeshBuilder.CreatePlane("overlayplane", { sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, scene);
    this.overlayCube = BABYLON.MeshBuilder.CreateBox("overlaycube", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
    this.boxShape = BABYLON.MeshBuilder.CreateBox("boxShape", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
    this.boxShapeSymm = BABYLON.MeshBuilder.CreateBox("boxShapeSymm", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
    this.magnet = BABYLON.MeshBuilder.CreateBox("magnet", { size: 1.1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
    this.symmPivot = undefined;
    this.isWorkplaneActive = false;
    this.isFloorPlaneActive = false;

    this.init = function() {
        this.gridPlane.material = material.mat_grid;
        this.gridPlane.isVisible = true;
        this.gridPlane.isPickable = true;
        this.gridPlane.position.x = -0.5;
        this.gridPlane.position.y = -0.5;
        this.gridPlane.position.z = -0.5;
        this.gridPlane.rotation.x = PIH;
        this.gridPlane.doNotSerialize = true;
        this.gridPlane.convertToUnIndexedMesh();
        this.gridPlane.freezeNormals();
        
        this.axisPlane.isVisible = false; // indicate symmetry-axis plane in AxisView scene
        this.axisPlane.isPickable = false;
        this.axisPlane.visibility = 0.3;
        this.axisPlane.doNotSerialize = true;
        highlightOverlayMesh(this.axisPlane, COL_AQUA_RGB); // overrided
        this.axisPlane.edgesWidth = 6;
        this.axisPlane.edgesColor = COL_AQUA_RGBA;
        this.axisPlane.enableEdgesRendering();
        this.axisPlane.convertToUnIndexedMesh();
        this.axisPlane.freezeNormals();

        this.overlayPlane.isVisible = false;
        this.overlayPlane.isPickable = false;
        this.overlayPlane.visibility = 0.01;
        this.overlayPlane.doNotSerialize = true;
        highlightOverlayMesh(this.overlayPlane, COL_ORANGE_RGB, 1);
        this.overlayPlane.convertToUnIndexedMesh();
        this.overlayPlane.freezeNormals();

        this.overlayCube.isVisible = false;
        this.overlayCube.isPickable = false;
        this.overlayCube.visibility = 0.1;
        this.overlayCube.doNotSerialize = true;
        highlightOverlayMesh(this.overlayCube, COL_ORANGE_RGB);
        this.overlayCube.convertToUnIndexedMesh();
        this.overlayCube.freezeNormals();

        this.floorPlane.position.copyFrom(this.gridPlane.position);
        this.floorPlane.rotation.x = -PIH;
        this.floorPlane.material = material.mat_workplane;
        this.floorPlane.isVisible = false;
        this.floorPlane.isPickable = true;
        this.floorPlane.visibility = WORKPLANE_VISIBILITY;
        this.floorPlane.doNotSerialize = true;
        this.floorPlane.convertToUnIndexedMesh();
        this.floorPlane.freezeNormals();

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
        this.workplane.convertToUnIndexedMesh();
        this.workplane.freezeNormals();

        this.boxShape.isVisible = false;
        this.boxShape.isPickable = false;
        this.boxShape.visibility = 0.1;
        this.boxShape.renderOverlay = true;
        this.boxShape.doNotSerialize = true;
        highlightOverlayMesh(this.boxShape, COL_ORANGE_RGB);
        highlightEdgesMesh(this.boxShape, COL_ORANGE_RGBA);
        this.boxShape.convertToUnIndexedMesh();
        this.boxShape.freezeNormals();

        this.boxShapeSymm.renderingGroupId = 1;
        this.boxShapeSymm.isVisible = false;
        this.boxShapeSymm.isPickable = false;
        this.boxShapeSymm.visibility = 0.1;
        this.boxShapeSymm.doNotSerialize = true;
        highlightEdgesMesh(this.boxShapeSymm, COL_AQUA_RGBA);
        this.boxShapeSymm.edgesColor.a = 0.4;
        this.boxShapeSymm.convertToUnIndexedMesh();
        this.boxShapeSymm.freezeNormals();

        this.magnet.isVisible = true;
        this.magnet.isPickable = true;
        this.magnet.layerMask = 0x00000000;
        this.magnet.doNotSerialize = true;
        this.magnet.convertToUnIndexedMesh();
        this.magnet.freezeNormals();

        const axisLines = [
            [ BABYLON.Vector3.Zero(), new BABYLON.Vector3(10, 0, 0) ],
            [ BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 10, 0) ],
            [ BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, 10) ]
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

    this.setGrid = function(min = 20) {
        const radius = builder.getRadius();
        let r = min;
        if (radius) r = radius;
        r = 2 * r + 4;
        this.gridPlane.scaling.x = r;
        this.gridPlane.scaling.y = r;
        this.gridPlane.scaling.z = r;
        this.gridPlane.material.gridRatio = 1 / r;
    }

    this.enableFloorPlane = function(isEnabled) {
        this.isFloorPlaneActive = isEnabled;
        this.displayFloorPlane(isEnabled);
        if (isEnabled)
            this.enableWorkplane(false);
    }

    this.enableWorkplane = function(isEnabled) {
        this.isWorkplaneActive = isEnabled;
        this.displayWorkplane(isEnabled);
        if (isEnabled)
            this.enableFloorPlane(false);
    }

    this.displayWorkplane = function(isEnabled) {
        this.workplane.isVisible = isEnabled;
        if (isEnabled) {
            ui.domInScreenWorkplane.firstChild.style.color = COL_ORANGE;
        } else {
            ui.domInScreenWorkplane.firstChild.style.color = COL_AQUA;
        }
    }

    this.displayFloorPlane = function(isEnabled) {
        this.floorPlane.isVisible = isEnabled;
        if (isEnabled) {
            ui.domInScreenFloorPlane.firstChild.style.color = COL_ORANGE;
        } else {
            ui.domInScreenFloorPlane.firstChild.style.color = COL_AQUA;
        }
    }

    this.toggleWorkplane = function(id) {
        if (id == 0) {
            this.isFloorPlaneActive = !this.isFloorPlaneActive;
            this.displayFloorPlane();
            this.enableFloorPlane(this.isFloorPlaneActive);
        } else {
            this.isWorkplaneActive = !this.isWorkplaneActive;
            this.displayWorkplane();
            this.enableWorkplane(this.isWorkplaneActive);
        }
    }

    this.setSymmPivot = function() {
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
            if (symmetry.axis == BABYLON.Axis.X) this.symmPivot.scaling.x *= 2;
            if (symmetry.axis == BABYLON.Axis.Y) this.symmPivot.scaling.y *= 2;
            if (symmetry.axis == BABYLON.Axis.Z) this.symmPivot.scaling.z *= 2;
        }
    }

    this.setAxisPlane = function(axis, pos) {
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

    this.toggleAxisPlane = function(isVisible) {
        this.axisPlane.isVisible = isVisible;
        this.symmPivot.isVisible = isVisible;
    }

    this.setOverlayPlane = function(pos, normAxis) {
        this.overlayPlane.isVisible = true;
        this.overlayPlane.position = pos;
        this.overlayPlane.rotationQuaternion = BABYLON.Quaternion.RotationAxis(
            BABYLON.Vector3.Cross(BABYLON.Axis.Z, normAxis),         // axis
            Math.acos(BABYLON.Vector3.Dot(normAxis, BABYLON.Axis.Z)) // angle
        );
    }

    this.setOverlayCube = function(pos, color = COL_ORANGE_RGB) {
        this.overlayCube.isVisible = true;
        this.overlayCube.position = pos;
        this.overlayCube.overlayColor = color;
    }

    this.clearOverlays = function() {
        this.overlayPlane.isVisible = false;
        this.overlayCube.isVisible = false;
    }

    this.setBoxShape = function(pos, scale, color) {
        this.boxShape.isVisible = true;
        this.boxShape.position = pos;
        this.boxShape.scaling = scale;
        this.boxShape.overlayColor = color;
        fixEdgesWidth(this.boxShape);
    }

    this.setBoxShapeSymmetry = function(pos, scale, color) {
        this.boxShapeSymm.isVisible = true;
        this.boxShapeSymm.position = pos;
        this.boxShapeSymm.scaling = scale;
        this.boxShapeSymm.overlayColor = color;
        fixEdgesWidth(this.boxShapeSymm);
    }

    this.updateBoxShape = function(hex) {
        this.boxShape.overlayColor = BABYLON.Color3.FromHexString(hex);
    }

    this.clearBoxShape = function() {
        this.boxShape.isVisible = false;
        this.boxShape.position = BABYLON.Vector3.Zero();
        this.boxShape.scaling = BABYLON.Vector3.Zero();
        this.boxShapeSymm.isVisible = false;
        this.boxShapeSymm.position = BABYLON.Vector3.Zero();
        this.boxShapeSymm.scaling = BABYLON.Vector3.Zero();
    }

    this.init();
}


// -------------------------------------------------------
// Tool


function Tool(scene) {
    this.name = 'camera';
    this.last = null;
    this.selected = [];
    this.isMouseDown = false;
    let isSymmetry = false;
    let isWorkplane = false;
    let startBox, startRect;
    let pos, posNorm;
    let sX, sY, sZ, eX, eY, eZ;
    let boxCount = 0;
    let fixedHeight = 0;
    let then = performance.now();
    let now, elapsed;
    let tmp = [];
    const VEC3_2 = new BABYLON.Vector3(2, 2, 2);

    this.init = function() {
        this.toolSelector(this.name);
    }

    this.add = function(pos) {
        builder.addNoDup(pos, currentColor, true);
        ghost.addThin(pos, currentColor);

        if (isSymmetry) {
            pos = symmetry.invertPos(pos);
            builder.addNoDup(pos, currentColor, true);
            ghost.addThin(pos, currentColor);
        }

        this.selected.push('');
    }

    this.addNoHelper = function(pos) {
        this.selected.push(pos);

        if (isSymmetry)
            this.selected.push(symmetry.invertPos(pos));
    }

    this.remove = function(pos) {
        this.selected.push(pos);
        ghost.addThin(pos, COL_RED);

        if (isSymmetry) {
            pos = symmetry.invertPos(pos);
            this.selected.push(pos);
            ghost.addThin(pos, COL_RED);
        }
    }

    this.removeNoHelper = function(pos) {
        this.selected.push(pos);

        if (isSymmetry)
            this.selected.push(symmetry.invertPos(pos));
    }

    this.paint = function(index, pos) {
        builder.voxels[index].color = currentColor;
        ghost.addThin(pos, currentColor);

        if (isSymmetry) {
            const index = symmetry.findIndexInvert(pos);
            if (index > -1) {
                builder.voxels[index].color = currentColor;
                ghost.addThin(builder.voxels[index].position, currentColor);
            }
        }
    }

    this.bucket = function(hex) {
        for (let i = 0; i < builder.voxels.length; i++) {
            if (builder.voxels[i].color === hex)
                builder.voxels[i].color = currentColor;
        }
    }

    this.eyedrop = function(hex) {
        currentColor = hex;
        uix.colorPicker.value = BABYLON.Color3.FromHexString(currentColor);
    }

    this.boxShape = function(start, end, color) {
        // dev note: I actually wrote this as a pseudo code,
        // but it works fine, so we didn't change it
        if (end.x <= start.x && end.y <= start.y && end.z <= start.z) {
            sX = end.x;      eX = start.x;
            sY = end.y;      eY = start.y;
            sZ = end.z;      eZ = start.z;
        }
        else if (start.x <= end.x && start.y <= end.y && start.z <= end.z) {
            sX = start.x;    eX = end.x;
            sY = start.y;    eY = end.y;
            sZ = start.z;    eZ = end.z;
        }

        else if (end.x <= start.x && start.y <= end.y && end.z <= start.z) {
            sX = end.x;      eX = start.x;
            sY = start.y;    eY = end.y;
            sZ = end.z;      eZ = start.z;
        }
        else if (start.x <= end.x && end.y <= start.y && start.z <= end.z) {
            sX = start.x;    eX = end.x;
            sY = end.y;      eY = start.y;
            sZ = start.z;    eZ = end.z;
        }

        else if (start.x <= end.x && end.y <= start.y && end.z <= start.z) {
            sX = start.x;    eX = end.x;
            sY = end.y;      eY = start.y;
            sZ = end.z;      eZ = start.z;
        }
        else if (end.x <= start.x && start.y <= end.y && start.z <= end.z) {
            sX = end.x;      eX = start.x;
            sY = start.y;    eY = end.y;
            sZ = start.z;    eZ = end.z;
        }

        else if (start.x <= end.x && start.y <= end.y && end.z <= start.z) {
            sX = start.x;    eX = end.x;
            sY = start.y;    eY = end.y;
            sZ = end.z;      eZ = start.z;
        }
        else if (end.x <= start.x && end.y <= start.y && start.z <= end.z) {
            sX = end.x;      eX = start.x;
            sY = end.y;      eY = start.y;
            sZ = start.z;    eZ = end.z;
        }

        const scale = new BABYLON.Vector3(1 + eX - sX, 1 + eY - sY, 1 + eZ - sZ);

        helper.setBoxShape(start.add(end).divide(VEC3_2), scale, color);
        
        if (isSymmetry) {
            helper.setBoxShapeSymmetry(
                symmetry.invertPos(start).add(symmetry.invertPos(end)).divide(VEC3_2),
                scale, color);
        }

        boxCount = helper.boxShape.scaling.x * helper.boxShape.scaling.y * helper.boxShape.scaling.z;
        if (boxCount > MAXAMOUNTBOX) {
            helper.updateBoxShape(COL_RED);
        }
    }

    this.boxSelectAdd = function(start, end, color) {
        if (fixedHeight > 0) // enable wall drawing
            end.y = start.y + fixedHeight - 1;

        this.boxShape(start, end, color);

        this.selected = [];
        if (boxCount > MAXAMOUNTBOX || boxCount == 0)
            return;

        for (let x = sX; x <= eX; x++) {
            for (let y = sY; y <= eY; y++) {
                for (let z = sZ; z <= eZ; z++) {
                    if (!builder.getVoxelAtXYZ(x, y, z))
                        this.selected.push(new BABYLON.Vector3(x, y, z));
                }
            }
        }
    }

    this.boxSelect = function(start, end, endNorm, color) {
        if (isWorkplane)
            end = endNorm;

        this.boxShape(start, end, color);

        this.selected = [];
        if (boxCount > MAXAMOUNTBOX || boxCount == 0)
            return;

        for (let x = sX; x <= eX; x++) {
            for (let y = sY; y <= eY; y++) {
                for (let z = sZ; z <= eZ; z++) {
                    if (builder.getVoxelAtXYZ(x, y, z))
                        this.selected.push(new BABYLON.Vector3(x, y, z));
                }
            }
        }
    }

    this.getVoxelsFromRectangleSelection = function(start) {
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

    this.rectSelect = function(start) {
        this.selected = this.getVoxelsFromRectangleSelection(start);
        this.selected = this.selected.filter((i) => i.visible);
        ghost.createThin(this.selected);
    }

    this.rectSelectFirst = function(start, norm, pick) {
        tmp = this.getVoxelsFromRectangleSelection(start);

        this.selected = [];
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].visible) {
                const pos = tmp[i].position.add(norm);

                if (!window.rc.raycast(
                        pos.x, pos.y, pos.z,
                        -pick.ray.direction.x,
                        -pick.ray.direction.y,
                        -pick.ray.direction.z)) {

                    this.selected.push({
                        position: pos,
                        color: currentColor,
                        visible: tmp[i].visible
                    });
                }
            }
        }

        ghost.createThin(this.selected);
    }

    this.pickWorkplane = function(pick, norm) {
        norm.z = parseInt(norm.z.toFixed(1)); // fix normal precision bug

        const pos = pick.pickedPoint.add(BABYLON.Vector3.One()).subtract(new BABYLON.Vector3(0.5,0.5,0.5)).floor();

        if (norm.x > 0) pos.x = -1;
        if (norm.y > 0) pos.y = -1;
        if (norm.z > 0) pos.z = -1;
        if (norm.x < 0) pos.x = 0;
        if (norm.y < 0) pos.y = 0;
        if (norm.z < 0) pos.z = 0;

        return pos;
    }

    this.onToolDown = function(pick) {
        const index = pick.INDEX;
        const norm = pick.NORMAL;
        isWorkplane = pick.ISWORKPLANE;
        isSymmetry = symmetry.axis !== -1;

        if (!isWorkplane) {
            pos = builder.voxels[index].position;
        } else {
            if (!workplaneWhiteList.includes(this.name)) return;
            pos = this.pickWorkplane(pick, norm);
        }

        posNorm = pos.add(norm);

        switch (this.name) {
            case 'add':
                this.add(posNorm);
                break;
            case 'remove':
                this.remove(pos);
                break;
            case 'paint':
                this.paint(index, pos);
                break;
            case 'eyedrop':
                this.eyedrop(builder.voxels[index].color);
                break;
            case 'bucket':
                this.bucket(builder.voxels[index].color);
                break;
            case 'hidecolor':
                palette.setColorVisible(builder.voxels[index].color, false);
                break;
            case 'isolatecolor':
                builder.setVoxelsVisibility(false);
                palette.setColorVisible(builder.voxels[index].color, true);
                break;
            case 'deletecolor':
                builder.deleteColorAndUpdate(builder.voxels[index].color);
                break;
            case 'box_add':
                this.addNoHelper(posNorm); // allow 1 voxel drawing
                startBox = posNorm;
                fixedHeight = parseInt(ui.domBoxToolHeight.value);
                break;
            case 'box_rem':
                this.removeNoHelper(pos);
                startBox = pos;
                if (isWorkplane)
                    startBox = posNorm;
                break;
            case 'box_paint':
                this.selected.push(pos);
                startBox = pos;
                if (isWorkplane)
                    startBox = posNorm;
                break;
            case 'rect_add':
                startRect = { x: scene.pointerX, y: scene.pointerY };
                ui.domMarquee.style.display = 'unset';
                break;
            case 'rect_remove':
                startRect = { x: scene.pointerX, y: scene.pointerY };
                ui.domMarquee.style.display = 'unset';
                break;
            case 'rect_paint':
                startRect = { x: scene.pointerX, y: scene.pointerY };
                ui.domMarquee.style.display = 'unset';
                break;
            case 'transform_box':
                xformer.apply();
                this.selected.push(pos);
                startBox = pos;
                if (isWorkplane)
                    startBox = posNorm;
                break;
            case 'transform_rect':
                xformer.apply();
                startRect = { x: scene.pointerX, y: scene.pointerY };
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
            case 'bakecolor':
                bakery.bakeColor(builder.voxels[index].color);
                break;
        }
    }

    this.onToolMove = function(pick) {
        const index = pick.INDEX;
        const norm = pick.NORMAL;
        isWorkplane = pick.ISWORKPLANE;

        if (!isWorkplane) {
            pos = builder.voxels[index].position;
        } else {
            if (!workplaneWhiteList.includes(this.name)) return;
            pos = this.pickWorkplane(pick, norm);            
        }

        posNorm = pos.add(norm);

        helper.setOverlayPlane(pos.add(norm.scale(0.5)), norm);

        if (!this.isMouseDown) return;

        switch (this.name) {
            case 'add':
                this.add(posNorm);
                break;
            case 'remove':
                this.remove(pos);
                break;
            case 'paint':
                this.paint(index, pos);
                break;
            case 'eyedrop':
                this.eyedrop(builder.voxels[index].color);
                break;
            case 'box_add':
                if (startBox)
                    this.boxSelectAdd(startBox, posNorm, BABYLON.Color3.FromHexString(currentColor));
                break;
            case 'box_rem':
                if (startBox)
                    this.boxSelect(startBox, pos, posNorm, COL_ORANGE_RGB);
                break;
            case 'box_paint':
                if (startBox)
                    this.boxSelect(startBox, pos, posNorm, BABYLON.Color3.FromHexString(currentColor));
                break;
            case 'rect_add':
                if (startRect)
                    this.rectSelectFirst(startRect, norm, pick);
                break;
            case 'rect_remove':
                if (startRect)
                    this.rectSelect(startRect);
                break;
            case 'rect_paint':
                if (startRect)
                    this.rectSelect(startRect);
                break;
            case 'transform_box':
                if (startBox)
                    this.boxSelect(startBox, pos, posNorm, COL_ORANGE_RGB);
                break;
            case 'transform_rect':
                if (startRect)
                    this.rectSelect(startRect);
                break;
        }
    }

    this.onToolUp = function() {
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
                    tmp = builder.createArrayFromNewPositions(this.selected, currentColor, isSymmetry);
                    builder.addArray(tmp);
                    builder.create();
                    builder.update();
                }
                break;
            case 'box_rem':
                if (this.selected.length > 0) {
                    tmp = builder.createArrayFromPositions(this.selected, isSymmetry);
                    builder.removeByArray(tmp);
                    builder.create();
                    builder.update();
                }
                break;
            case 'box_paint':
                if (this.selected.length > 0) {
                    tmp = builder.createArrayFromPositions(this.selected, isSymmetry);
                    builder.paintByArray(tmp, currentColor);
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
                    builder.removeByArray(this.selected);
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
                    tmp = builder.createArrayFromPositions(this.selected, isSymmetry);
                    xformer.begin(tmp);
                }
                break;
            case 'transform_rect':
                if (this.selected.length > 0)
                    xformer.begin(this.selected);
                break;
            case 'transform_visible':
                if (this.selected.length > 0) {
                    tmp = builder.createArrayFromPositions(this.selected, false);
                    xformer.begin(tmp);
                }
                break;
        }
    }

    this.handleToolDown = function(pickInfo) {
        this.isMouseDown = true;
        if (this.name !== 'camera' && !camera.isCameraChange() && !builder.isWorking) {
            scene.activeCamera.attachControl(canvas, true);
            this.setPickInfo(pickInfo, (p) => {
                scene.stopAnimation(camera.camera0);
                scene.activeCamera.detachControl(canvas);
                tool.onToolDown(p);
            });
        }
    }

    this.handleToolMove = function(pickInfo) {
        if (this.name !== 'camera' && !camera.isCameraChange() && !builder.isWorking) {
            now = performance.now();
            elapsed = now - then;
            if (elapsed > FPS_TOOLMOVE) {
                then = now - (elapsed % FPS_TOOLMOVE);
                this.setPickInfo(pickInfo, (p) => {
                    tool.onToolMove(p);
                });
            }
        }
    }

    this.handleToolUp = function() {
        this.isMouseDown = false;
        if (this.name !== 'camera') {
            tool.onToolUp();

            this.selected = [];
            sX = 0; sY = 0; sZ = 0;
            eX = 0; eY = 0; eZ = 0;
            boxCount = 0;
            startBox = null;
            startRect = null;

            ghost.disposeThin();
            helper.clearBoxShape();
            setTimeout(() => { // a little hack to prevent last overlay in touchscreen
                helper.clearOverlays();
            }, 10);

            ui.domMarquee.style = "display: none; left: 0; top: 0; width: 0; height: 0;";
        }
    }

    const predicateWorkplane = function(mesh) {
        if (helper.isFloorPlaneActive && helper.floorPlane.isVisible)
            return mesh == helper.floorPlane;
        if (helper.isWorkplaneActive && helper.workplane.isVisible)
            return mesh == helper.workplane;
        return null;
    };

    const predicateMagnet = function(mesh) {
        return mesh == helper.magnet;
    };

    const directions = [
        new BABYLON.Vector3(1, 0, 0),
        new BABYLON.Vector3(-1, 0, 0),
        new BABYLON.Vector3(0, 1, 0),
        new BABYLON.Vector3(0, -1, 0),
        new BABYLON.Vector3(0, 0, 1),
        new BABYLON.Vector3(0, 0, -1)
    ];

    let norms = [];
    function normalProbe(p) { // find picking-normal
        norms = [];           // to eliminate the bvh-generation lag

        for (let i = 0; i < directions.length; i++) { // omni normal-finder
            if (!builder.getIndexAtPosition(p.add(directions[i])))
                norms.push(directions[i]);
        }

        if (norms.length > 0) {
            if (norms.length == 1) { // surface
                return norms[0];
            } else { // edge, TODO: trading accuracy is not necessary
                helper.magnet.position = p; // magnetic normal-finder
                const pick = scene.pick(scene.pointerX, scene.pointerY, predicateMagnet);
                if (pick && pick.hit)
                    return pick.getNormal(true);
            }
        }
        return null;
    }

    this.setPickInfo = function(pick, onHit) {
        const index = builder.getIndexAtPointer();
        if (index > -1) {
            if (preferences.getBvhPicking()) { // accurate but also introduce lag
                const res = window.rc.raycast(
                    pick.ray.origin.x,
                    pick.ray.origin.y,
                    pick.ray.origin.z,
                    pick.ray.direction.x,
                    pick.ray.direction.y,
                    pick.ray.direction.z);
                if (res) {
                    pick.INDEX = index;
                    pick.NORMAL = new BABYLON.Vector3(-res.face.normal.x, -res.face.normal.y, -res.face.normal.z);
                    pick.ISWORKPLANE = false;
                    onHit(pick);
                } else {
                    helper.clearOverlays();
                }
            } else { // less accurate but lag-free
                const norm = normalProbe(builder.voxels[index].position);
                if (norm) {
                    pick.INDEX = index;
                    pick.NORMAL = norm;
                    pick.ISWORKPLANE = false;
                    onHit(pick);
                } else {
                    helper.clearOverlays();
                }
            }
        } else {
            helper.clearOverlays();
            
            pick = scene.pick(scene.pointerX, scene.pointerY, predicateWorkplane);
            if (pick && pick.hit) {
                pick.INDEX = pick.faceId;
                pick.NORMAL = pick.getNormal(true);
                pick.ISWORKPLANE = true;
                onHit(pick);
            } else {
                helper.clearOverlays();
            }
        }
    }

    this.toolSelector = function(toolName, finishTransforms = false) {
        this.name = toolName;

        const elem = document.getElementsByClassName('tool_' + this.name);
        for (const i of document.querySelectorAll('li'))
            if (i.classList.contains("tool_selector"))
                i.classList.remove("tool_selector");
        for (const i of document.querySelectorAll('button'))
            if (i.classList.contains("tool_selector"))
                i.classList.remove("tool_selector");
        for (let i = 0; i < elem.length; i++)
            elem[i].classList.add("tool_selector");

        scene.activeCamera.attachControl(canvas, true);
        helper.clearOverlays();

        if (finishTransforms)
            xformer.apply();
    }

    this.init();
}


// -------------------------------------------------------
// Symmetry


function Symmetry() {
    this.axis = -1; // BABYLON.Axis.X

    this.setAxis = function(axis) {
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

    this.switchAxis = function() {
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

    this.switchAxisByNum = function(axis) {
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

    this.resetAxis = function() {
        this.setAxis(-1);
    }

    this.symmetrizeVoxels = function(side) {
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

    this.mirrorVoxels = function() {
        if (this.axis == -1) {
            ui.notification('select symmetry axis');
            return;
        }
        builder.setVoxelsVisibility(true);
        this.invertVoxels();
        builder.create();
        builder.update();
    }

    this.deleteHalfVoxels = function(side) {
        if (this.axis == -1) {
            ui.notification('select symmetry axis');
            return;
        }
        builder.setVoxelsVisibility(true);
        this.deleteHalf(side);
        builder.create();
        builder.update();
    }

    this.invertVoxels = function() {
        for (let i = 0; i < builder.voxels.length; i++)
            builder.voxels[i].position = this.invertPos(builder.voxels[i].position);
    }

    this.invertVoxelsClone = function() {
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

    this.deleteHalf = function(side) { // preserve 0 borders, prevent duplicates at the middle
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

        builder.removeByArray(toDelete);
    }

    this.invertPos = function(p) { // invert positive to negative and reverse
        if (this.axis == BABYLON.Axis.X) p = new BABYLON.Vector3(this.center2(p.x), p.y, p.z);
        if (this.axis == BABYLON.Axis.Y) p = new BABYLON.Vector3(p.x, this.center2(p.y), p.z);
        if (this.axis == BABYLON.Axis.Z) p = new BABYLON.Vector3(p.x, p.y, this.center2(p.z));
        return p;
    }

    this.center = function(p) { // calculate position from center
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

    this.center2 = function(p) { // calculate position from center*2
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

    this.findIndexInvert = function(p) {
        return builder.getIndexAtPosition(this.invertPos(p));
    }
}


// -------------------------------------------------------
// Voxelizer


function Voxelizer(scene) {
    this.voxelizeMesh = function(mesh) {
        const scale = parseInt(document.getElementById('input-voxelizer-scale').value);

        normalizeMesh(mesh, scale);
        const data = window.voxelizeMesh(mesh, scale, currentColor);
        
        builder.setDataFromArray(data);
        clearScene();
    }

    this.voxelizeBake = async function() {
        if (bakery.selected) {
            const isClear = document.getElementById('input-unbake-clear').checked;
            if (isClear && !await ui.showConfirm('clear and replace all voxels?')) return;

            const data = window.voxelizeBake(bakery.selected);

            if (isClear) {
                ui.setMode(0);
                builder.setDataFromArray(data);
                builder.normalizeVoxelPositions();
            } else {
                ui.setMode(0);
                xformer.beginNewObject(data, false);
            }
            clearScene();
        } else {
            ui.notification('select a bake');
        }
    }

    this.voxelize2D = function(imgData) {
        engine.displayLoadingUI();
        const ratio = parseFloat(document.getElementById('input-voxelizer-ratio').value);
        const zUp = document.getElementById('input-voxelizer-zup').checked;
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
                    if (zUp) {
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
            engine.hideLoadingUI();
        }
    }

    this.importMeshOBJ = function(url) {
        engine.displayLoadingUI();
        BABYLON.SceneLoader.LoadAssetContainerAsync(url, "", scene, null, '.obj')
            .then((container) => {
                const mesh = BABYLON.Mesh.MergeMeshes(container.meshes, true, true);
                container.removeAllFromScene();
                voxelizer.voxelizeMesh(mesh);
                mesh.dispose();
                engine.hideLoadingUI();
            }).catch((err) => {
                engine.hideLoadingUI();
                ui.notification("unable to import/merge meshes");
                console.error(err.message);
            });
    }

    this.importMeshGLB = function(url) {
        engine.displayLoadingUI();
        BABYLON.SceneLoader.LoadAssetContainerAsync(url, "", scene, null, '.glb')
            .then((container) => {
                const meshes = [];
                for (let i = 0; i < container.meshes.length; i++) {
                    if (container.meshes[i].name !== '__root__')
                        meshes.push(container.meshes[i]);
                }
                if (meshes.length > 0) {
                    const mesh = BABYLON.Mesh.MergeMeshes(meshes, true, true);
                    voxelizer.voxelizeMesh(mesh);
                    mesh.dispose();
                } else {
                    ui.notification('unable to find meshes');
                }
                container.removeAllFromScene();
                engine.hideLoadingUI();
            }).catch((err) => {
                engine.hideLoadingUI();
                ui.notification("unable to import/merge meshes");
                console.error(err.message);
            });
    }

    this.loadFromUrl = function(url) {
        if (url == "") return;
        engine.displayLoadingUI();
        fetch(url).then(res => {
            if (res.status == 200) {
                if (url.toLowerCase().includes('.obj') || url.endsWith('.obj')) {
                    voxelizer.importMeshOBJ(url);
                } else if (url.toLowerCase().includes('.glb') || url.endsWith('.glb')) {
                    voxelizer.importMeshGLB(url);
                } else {
                    ui.notification("unsupported file format");
                    engine.hideLoadingUI();
                }
            } else {
                ui.notification("unable to read url");
                engine.hideLoadingUI();
            }
        }).catch(err => {
            ui.notification("unable to read url");
            engine.hideLoadingUI();
        });
    }

    this.loadFromUrlImage = function(url) {
        if (url == "") return;
        engine.displayLoadingUI();
        fetch(url).then(async res => {
            if (res.status == 200) {
                const data = await res.blob();
                if (data.type &&
                    (data.type == 'image/png'  ||
                     data.type == 'image/jpeg' ||
                     data.type == 'image/svg+xml')) {
                        voxelizer.voxelize2D(url);
                } else {
                    ui.notification("unsupported file format");
                    engine.hideLoadingUI();
                }
            } else {
                ui.notification("unable to read url");
                engine.hideLoadingUI();
            }
        }).catch(err => {
            ui.notification("unable to read url");
            engine.hideLoadingUI();
        });
    }

    this.pasteBase64Image = function() {
        navigator.clipboard.readText()
            .then(url => {
                if (url.startsWith('data:image/')) {
                    voxelizer.voxelize2D(url);
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


function Generator() {
    this.newBoxData = function(size, color) {
        const data = [];
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    data.push({
                        position: new BABYLON.Vector3(x, y, z),
                        color: color,
                        visible: true
                    });
                }
            }
        }
        return data;
    }

    this.newBox = function(size, color) {
        const data = this.newBoxData(size, color);
        builder.voxels = [];
        for (let i = 0; i < data.length; i++) 
            builder.add(data[i].position, data[i].color, data[i].visible);
    }

    this.createBox = async function(isPlane = false) {
        const isNewScene = document.getElementById('input-grid-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        
        const isFill = document.getElementById('input-grid-fill').checked;
        const X = parseInt(document.getElementById('input-grid-x').value);
        let Y = parseInt(document.getElementById('input-grid-y').value);
        const Z = parseInt(document.getElementById('input-grid-z').value);
        if (isPlane) Y = 1;
        
        let data = [];
        if (isFill) {
            for (let x = 0; x < X; x++) {
                for (let y = 0; y < Y; y++) {
                    for (let z = 0; z < Z; z++) {
                        data.push({
                            position: new BABYLON.Vector3(x, y, z),
                            color: currentColor,
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
                                color: currentColor,
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
            if (data.length < MAXAMOUNTBOX / 2) {
                xformer.beginNewObject(data);
            } else {
                ui.notification('exceeds the limit, check new scene');
            }
        }

        data = null;
    }

    this.createIsometric = async function() {
        const isNewScene = document.getElementById('input-grid-new').checked;
        if (isNewScene && !await ui.showConfirm('clear and replace all voxels?')) return;
        const X = parseInt(document.getElementById('input-grid-x').value);
        const Y = parseInt(document.getElementById('input-grid-y').value);
        const Z = parseInt(document.getElementById('input-grid-z').value);

        let data = [];
        for (let x = 0; x < X; x++) {
            for (let y = 0; y < Y; y++) {
                for (let z = 0; z < Z; z++) {
                    if (x == 0 || y == 0 || z == 0)
                        data.push({
                            position: new BABYLON.Vector3(x, y, z),
                            color: currentColor,
                            visible: true
                        });
                }
            }
        }

        if (isNewScene) {
            builder.setDataFromArray(data);
            clearScene();
        } else {
            if (data.length < MAXAMOUNTBOX / 2) {
                xformer.beginNewObject(data);
            } else {
                ui.notification('exceeds the limit, check new scene');
            }
        }

        data = null;
    }

    this.createSphere = async function() {
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
        let data = [];

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
                            color: currentColor,
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
            if (data.length < MAXAMOUNTBOX / 2) {
                xformer.beginNewObject(data);
            } else {
                ui.notification('exceeds the limit, check new scene');
            }
        }

        data = null;
    }

    this.createTerrain = async function() {
        if (!await ui.showConfirm('clear and replace all voxels?')) return;
        const isHeightGrad = document.getElementById('input-terrain-grad').checked;
        const X = parseInt(document.getElementById('input-terrain-x').value);
        const Y = parseInt(document.getElementById('input-terrain-y').value);
        const Z = parseInt(document.getElementById('input-terrain-z').value);

        const simplex = new window.simplexNoise();
        const colArrayHigh = gradientHexArray('#87BC24', '#31A531', Y);
        const colArrayLow  = gradientHexArray('#217EC4', '#31A531', Y);

        let xoff = 0;
        let zoff = 0;
        let v = 0;
        let data = [];
        for (let x = 0; x < X; x++) {
            for (let z = 0; z < Z; z++) {
                xoff = (0.2 / Y) * x; // fill x and z
                zoff = (0.2 / Y) * z; // relative to Y
                v = ~~(simplex.noise3d(xoff, 0, zoff) * Y);
                if (v >= 0) {
                    data.push({
                        position: new BABYLON.Vector3(x, v, z),
                        color: (isHeightGrad) ? colArrayHigh[ v ] : currentColor,
                        visible: true
                    });
                } else {
                    data.push({
                        position: new BABYLON.Vector3(x, v, z),
                        color: (isHeightGrad) ? colArrayLow[ Math.abs(v) ] : currentColor,
                        visible: true
                    });
                }
            }
        }

        builder.setDataFromArray(data);
        builder.normalizeVoxelPositions();
        clearScene();

        data = null;
    }
}


// -------------------------------------------------------
// Bakery


function Bakery(scene) {
    this.meshes = [];
    this.selected = null;
    this.lastSelected = null;
    this.pick = null;

    this.exportOptions = {
        shouldExportNode: (node) => {
            return bakery.meshes.includes(node);
        }
    };

    this.exportOptionsSelected = {
        shouldExportNode: (node) => {
            if (ui.domExportSelectedBake.checked && bakery.selected)
                return bakery.selected === node;
            return false;
        }
    };
    
    this.bakeToMesh = function(voxels = builder.voxels) {
        const baked = window.baker('_bake', voxels);

        resetPivot(baked);

        baked.material = material.mat_pbr.clone('_bake');

        baked.checkCollisions = true;
        baked.receiveShadows = true;

        light.addMesh(baked);
        light.updateShadowMap();

        this.meshes.push(baked);
        this.createBakeryList();
    }

    this.newBake = function(voxels = null) {
        engine.displayLoadingUI();
        setTimeout(() => {
            if (MODE !== 2) ui.setMode(2);
            material.setPBRTexture();

            (voxels) ? this.bakeToMesh(voxels) : this.bakeToMesh();

            uix.bindTransformGizmo(this.meshes[this.meshes.length-1]);
            uix.gizmo.attachToMesh(this.meshes[this.meshes.length-1]);

            camera.frame();
            engine.hideLoadingUI();
        }, 100);
    }

    this.bakeColor = function(hex) {
        engine.displayLoadingUI();
        setTimeout(() => {
            if (MODE !== 2) ui.setMode(2);
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
            engine.hideLoadingUI();
        }, 100);
    }

    this.bakeColor = function(hex) {
        engine.displayLoadingUI();
        setTimeout(() => {
            if (MODE !== 2) ui.setMode(2);
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
            engine.hideLoadingUI();
        }, 100);
    }

    this.bakeAll = async function() {
        if (!await ui.showConfirm('clear and bake all voxels?')) return;
        engine.displayLoadingUI();
        setTimeout(() => {
            if (MODE !== 2) ui.setMode(2);
            material.setPBRTexture();
            this.clearBakes();

            this.bakeToMesh();

            camera.frame();
            engine.hideLoadingUI();
        }, 100);
    }

    this.bakeAllColors = async function() {
        if (!await ui.showConfirm('clear and bake all voxels<br>grouped by colors?')) return;
        engine.displayLoadingUI();
        setTimeout(() => {
            if (MODE !== 2) ui.setMode(2);
            material.setPBRTexture();
            this.clearBakes();

            for (let i = 0; i < palette.uniqueColors.length; i++)
                this.bakeToMesh(builder.getVoxelsByColor(palette.uniqueColors[i]));

            camera.frame();
            engine.hideLoadingUI();
        }, 100);
    }

    this.cloneSelected = function() {
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

    this.mergeAll = async function() {
        if (this.meshes.length > 0) {
            if (!await ui.showConfirm('merge all baked meshes?')) return;

            const mesh = BABYLON.Mesh.MergeMeshes(this.meshes, true, true);
            resetPivot(mesh);
            mesh.name = '_merge';

            clearMeshArray();

            material.setPBRTexture();
            mesh.material = material.mat_pbr.clone('_merge');

            mesh.checkCollisions = true;
            mesh.receiveShadows = true;
            light.addMesh(mesh);
            light.updateShadowMap();

            uix.bindTransformGizmo(mesh);
            uix.gizmo.attachToMesh(mesh);
            
            bakery.meshes.push(mesh);
            bakery.createBakeryList();
        }
    }

    this.deleteSelected = async function() {
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

    this.selectMesh = function(mesh) {
        this.selected = mesh;
        this.lastSelected = mesh;
        highlightOutlineMesh(mesh, COL_ORANGE_RGBA);
        this.bakeListSelect(mesh);
    }

    this.deselectMesh = function() {
        this.selected = null;
        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].renderOverlay = false;
            this.meshes[i].renderOutline = false;
        }
        this.bakeListDeselect();
    }

    this.onGizmoAttached = function(mesh) {
        bakery.deselectMesh(); // on user select
        bakery.selectMesh(mesh);
        bakery.getMaterial();
    }

    this.setBakesVisibility = function(isVisible) {
        for (let i = 0; i < this.meshes.length; i++)
            this.meshes[i].isVisible = isVisible;
    }

    this.resetRotation = function() {
        if (this.selected) {
            this.selected.rotation = BABYLON.Vector3.Zero();
            light.updateShadowMap();
        } else {
            ui.notification('select a mesh');
        }
    }

    this.clearBakes = async function(isAlert = false) {
        if (this.meshes.length > 0) {
            if (isAlert && !await ui.showConfirm('clear all baked meshes?')) return;
            clearMeshArray();
            this.selected = null;
            this.createBakeryList();
            uix.unbindTransformGizmo();
            light.updateShadowMap();
        }
    }
    
    this.getMaterial = function() {
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

    this.setMaterial = function(type) {
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
                    this.selected.visibility = parseFloat(ui.domAlpha.value); // set alpha seth!
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

    this.replaceTexture = function() {
        if (this.selected && this.selected.material) {
            if (this.selected.material.albedoTexture)
                this.selected.material.albedoTexture.dispose();
            this.selected.material.albedoTexture = material.textures[material.texId].clone();
        }
    }

    this.updateReflectionTextures = function() {
        for (let i = 0; i < this.meshes.length; i++) {
            if (this.meshes[i].material.reflectionTexture)
                this.meshes[i].material.reflectionTexture.dispose();
            this.meshes[i].material.reflectionTexture = scene.environmentTexture.clone();
            this.meshes[i].material.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
        }
    }

    this.updateVertexColors = function(hex = '#FFFFFF') {
        if (this.selected) {
            const colors = [];
            const rgb = BABYLON.Color3.FromHexString(hex).toLinearSpace();
            for (let i = 0; i < this.selected.getVerticesData(BABYLON.VertexBuffer.PositionKind).length/3; i++) {
                colors.push(rgb.r, rgb.g, rgb.b, 1);
            }
            this.selected.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
        } else {
            ui.notification('select a mesh');
        }
    }

    this.createBakeryList = function() {
        ui.domBakeryList.innerHTML = "";
        for (let i = 0; i < bakery.meshes.length; i++) {
            const item = document.createElement('div');
            const name = document.createElement('div');
            name.classList.add('item_name');
            name.innerHTML = bakery.meshes[i].name;
            name.spellcheck = false;
            item.onclick = () => {
                bakery.deselectMesh();
                bakery.selectMesh(bakery.meshes[i]);
                uix.bindTransformGizmo(this.meshes[i]);
                uix.gizmo.attachToMesh(this.meshes[i]);
            };
            item.onkeyup = () => {
                bakery.meshes[i].name = name.innerHTML;
            };
            item.onpaste = (ev) => {
                ev.preventDefault();
                name.innerHTML = ev.clipboardData.getData('Text');
                bakery.meshes[i].name = name.innerHTML;
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

    this.bakeListSelect = function(mesh) {
        let idx = -1;
        for (let i = 0; i < bakery.meshes.length; i++)
            if (bakery.meshes[i] === mesh)
                idx = i;
        
        if (ui.domBakeryList.children[idx]) {
            for (const i of ui.domBakeryList.children)
                i.firstChild.classList.remove("bakery_select");
            ui.domBakeryList.children[idx].firstChild.classList.add('bakery_select');
        }
    }

    this.bakeListDeselect = function() {
        for (const i of ui.domBakeryList.children)
            i.firstChild.classList.remove("bakery_select");
    }

    this.loadBakes = function(url, isLoadBakery, isInsideBakery = false) {
        engine.displayLoadingUI();
        BABYLON.SceneLoader.LoadAssetContainerAsync("", url, scene, null, '.glb')
            .then((container) => {
                let count = 0;
                for (let i = 0; i < container.meshes.length; i++) {
                    if (container.meshes[i].name !== '__root__') {
                        const baked = container.meshes[i].clone(container.meshes[i].name);
                        normalizeMeshGLTF(baked, container.meshes[i].material.clone(container.meshes[i].name));
                        bakery.meshes.push(baked);
                        count += 1;
                    }
                }
                container.removeAllFromScene();

                if (count == 0) {
                    ui.notification('unable to load baked meshes');
                } else {
                    if (!isInsideBakery) {
                        (isLoadBakery) ? ui.setMode(2) : ui.setMode(0);
                    } else {
                        builder.setMeshVisibility(false); // user may act faster
                    }
                    bakery.updateReflectionTextures();
                    bakery.createBakeryList();
                    light.updateShadowMap();
                }
                engine.hideLoadingUI();
            }).catch((reason) => {
                engine.hideLoadingUI();
                ui.notification("unable to load bake");
                console.error(reason.message);
            });
    }

    function normalizeMeshGLTF(mesh, material) {
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

    function clearMeshArray() {
        scene.blockfreeActiveMeshesAndRenderingGroups = true; // save unnecessary
        for (let i = 0; i < bakery.meshes.length; i++) { // dispose() computation
            if (bakery.meshes[i].material.albedoTexture)
                bakery.meshes[i].material.albedoTexture.dispose();
            if (bakery.meshes[i].material.reflectionTexture)
                bakery.meshes[i].material.reflectionTexture.dispose();
            bakery.meshes[i].material.dispose();
            bakery.meshes[i].dispose();
        }
        scene.blockfreeActiveMeshesAndRenderingGroups = false;
        bakery.meshes = [];
    }
}


// -------------------------------------------------------
// Snapshot


function Snapshot(scene) {
    const strVox = 'vbstore_voxels';
    const strVoxSnap = 'vbstore_voxels_snap';
    const strVoxSnapImage = 'vbstore_voxels_snap_img';
    const strBakes = 'vbstore_bakes';

    this.init = function() {
        this.createSnapshots();
    }

    this.setStorageVoxels = function(name = strVox) {
        localStorage.setItem(name, builder.getData());
    }

    this.getStorageVoxels = function(name = strVox) {
        const data = localStorage.getItem(name);
        if (!data) {
            ui.notification("empty storage");
            return;
        }
        builder.setData(data);
        clearScene();
    }

    this.setStorageBakes = function() {
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
    
    this.getStorageBakes = function() {
        const data = localStorage.getItem(strBakes);
        if (!data) {
            ui.notification("empty storage");
            return;
        }
        if (data !== '0') {
            bakery.clearBakes(false);
            bakery.loadBakes(data, true, true);
        }
    }

    this.delStorage = function(name) {
        if (localStorage.getItem(name))
            localStorage.removeItem(name);
    }

    this.createSnapshots = function() {
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
                if (!await ui.showConfirm('delete snapshot?')) return;
                img.src = SNAPSHOT;
                snapshot.delStorage(strVoxSnap + img.id);
                snapshot.delStorage(strVoxSnapImage + img.id);
            }, false);

            save.addEventListener("click", () => {
                createScreenshotBasic(img.clientWidth, img.clientHeight, (data) => {
                    img.src = data;
                    snapshot.setStorageVoxels(strVoxSnap + img.id);
                    localStorage.setItem(strVoxSnapImage + img.id, data);
                });
            }, false);

            img.addEventListener("click", () => {
                snapshot.getStorageVoxels(strVoxSnap + img.id);
            }, false);

            img.addEventListener("dragstart", (ev) => {
                ev.preventDefault();
            }, false);
        }
    }

    this.init();
}


// -------------------------------------------------------
// Memory


function Memory() {
    this.stack = [];
    this.block = -1;

    this.record = function(current) {
        if (this.stack[this.block] !== current) { // on change (not detect all changes)
            this.stack[++this.block] = current;
            this.stack.splice(this.block + 1); // delete anything forward
        }
    }

    this.undo = function() {
        --this.block;
        if (this.stack[this.block]) {
            builder.setData(this.stack[this.block]);
        } else {
            ++this.block;
        }
    }

    this.redo = function() {
        ++this.block;
        if (this.stack[this.block]) {
            builder.setData(this.stack[this.block]);
        } else {
            --this.block;
        }
    }

    this.reset = function() {
        this.stack[++this.block] = builder.getData();
        this.stack.splice(this.block + 1);
    }

    this.clear = function() {
        this.stack = [];
        this.block = -1;
        this.reset(); // init memory block 0
    }
}


// -------------------------------------------------------
// Project


function Project(scene) {
    function serializeScene(voxels, meshes) {
        const json = {
            version: "Voxel Builder 4.2.8",
            project: {
                name: "name",
                voxels: builder.voxels.length,
                meshes: bakery.meshes.length
            },
            scene: {
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

    function updateScene(data) {
        if (data.bgcolor) {
            setProjectValues(ui.domColorPickerBackground, data.bgcolor, '#6C6F7A');
        }
        if (data.lightcolor) {
            setProjectValues(ui.domColorPickerLightColor, data.lightcolor, '#CCCCCC');
            light.updateColor(ui.domColorPickerLightColor.value);
        }
    }

    this.newProject = async function(isAlert, color = currentColor) {
        if (isAlert && !await ui.showConfirm('create new project?')) return;
        
        generator.newBox(20, color);
        builder.create();
        clearSceneAndReset();
        ui.domProjectName.value = 'untitled';
    }

    this.save = function() {
        const json = serializeScene(builder.getDataString(), "");

        if (bakery.meshes.length > 0) {
            BABYLON.GLTF2Export.GLBAsync(scene, ui.domProjectName.value, bakery.exportOptions).then((glb) => {
                const blob = glb.glTFFiles[ui.domProjectName.value + ".glb"];
                const file = new File([ blob ], "exported.glb");
                const reader = new FileReader();
                reader.onload = () => {
                    json.data.meshes = reader.result;
                    saveDialog(JSON.stringify(json, null, 4), ui.domProjectName.value + '.json');
                }
                reader.readAsDataURL(file);
            });
        } else {
            saveDialog(JSON.stringify(json, null, 4), ui.domProjectName.value + '.json');
        }
    }

    this.load = function(data) {
        if (data.startsWith(';')) {
            loader(parseINI(data)); // backward compatibity < 4.0.3
            return;
        }
        
        try {
            loader(JSON.parse(data));
        } catch(err) {
            ui.notification("unsupported data format");
        }
    }

    function loader(data) {
        // project
        ui.domProjectName.value = data.project.name;

        // scene
        if (data.scene)
            updateScene(data.scene)

        // data.voxels
        ui.setMode(0);
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

    this.exportVoxels = function() {
        engine.displayLoadingUI();

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
                    engine.hideLoadingUI();
                });
                break;
            case 'gltf':
                BABYLON.GLTF2Export.GLTFAsync(scene, ui.domProjectName.value, options).then((gltf) => {
                    gltf.downloadFiles();
                    mesh.dispose();
                    engine.hideLoadingUI();
                });
                break;
            case 'obj':
                downloadBlob(new Blob([ 
                    BABYLON.OBJExport.OBJ([ mesh ], false, 'material', true)
                ], { type: "octet/stream" }), ui.domProjectName.value + '.obj');
                mesh.dispose();
                engine.hideLoadingUI();
                break;
            case 'stl':
                BABYLON.STLExport.CreateSTL([ mesh ], true, ui.domProjectName.value, false, false, false);
                mesh.dispose();
                engine.hideLoadingUI();
                break;
        }
    }

    this.exportBakes = function() {
        if (bakery.meshes.length == 0) {
            ui.notification('no baked meshes');
            return;
        }
        if (ui.domExportSelectedBake.checked && !bakery.selected) {
            ui.notification('select a mesh');
            return;
        }
        engine.displayLoadingUI();

        let exports;

        exports = bakery.exportOptions;
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
                    engine.hideLoadingUI();
                });
                break;
            case 'gltf':
                BABYLON.GLTF2Export.GLTFAsync(scene, ui.domProjectName.value, exports).then((gltf) => {
                    gltf.downloadFiles();
                    engine.hideLoadingUI();
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
        engine.hideLoadingUI();
    }

    this.loadFromUrl = function(url, callback = undefined) {
        if (url == '') return; // ignore first preset option
        loadUrl(url, (data) => {
            project.load(data);
            if (callback) callback();
        });
    }

    this.loadMagicaVoxel = function(buffer) {
        window.worker.start('parseMagicaVoxel', buffer, (data) => {
            const voxels = [];
            for (let i = 0; i < data.length; i++) {
                voxels.push({ 
                    position: new BABYLON.Vector3(data[i].x, data[i].y, data[i].z),
                    color: data[i].color,
                    visible: true
                });
            }
            ui.setMode(0);
            builder.setDataFromArray(voxels, true);
            builder.normalizeVoxelPositions(false);
            clearSceneAndReset();
            ui.domProjectName.value = 'untitled';
        }, () => {
            ui.notification('incompatible vox file');
        });
    }

    function setProjectValues(uiDom, iniKey, defVal) {
        (iniKey) ? uiDom.value = iniKey : uiDom.value = defVal;
    }
}


// -------------------------------------------------------
// UserInterface


function UserInterface(scene) {
    this.domMenusRight = [
        document.getElementById('menu-about'),
        document.getElementById('menu-prefs'),
        document.getElementById('menu-file'),
        document.getElementById('menu-generator'),
        document.getElementById('menu-voxelizer'),
        document.getElementById('menu-symmetry'),
        document.getElementById('menu-model'),
        document.getElementById('menu-paint'),
        document.getElementById('menu-voxels'),
        document.getElementById('menu-bakery'),
        document.getElementById('menu-meshes'),
    ];
    this.domMenusLeft = [
        document.getElementById('menu-pathtracer'),
        document.getElementById('menu-camera'),
        document.getElementById('menu-env'),
        document.getElementById('menu-material'),
        document.getElementById('menu-texture'),
        document.getElementById('menu-storage'),
        document.getElementById('menu-groups')
    ];
    this.domToolbarR = document.getElementById('toolbar_R');
    this.domToolbarL = document.getElementById('toolbar_L');
    this.domToolbarC = document.getElementById('toolbar_C');
    this.domToolbarC_mem = document.getElementById('toolbar_C_mem');
    this.domModes = document.querySelectorAll('#toolbar_C li.mode');
    this.domMenus = document.getElementById('menus');
    this.domMenuInScreenRight = document.getElementById('menu-inscreen-right');
    this.domMenuInScreenBottom = document.getElementById('menu-inscreen-bottom');
    this.domInScreenSymmAxis = document.getElementById('btn-inscreen-symmetry');
    this.domInScreenOrtho = document.getElementById('btn-inscreen-ortho');
    this.domInScreenFloorPlane = document.getElementById('btn-inscreen-floorplane');
    this.domInScreenWorkplane = document.getElementById('btn-inscreen-workplane');
    this.domInScreenLightLocator = document.getElementById('btn-inscreen-lightlocator');
    this.domInScreenBucket = document.getElementById('btn-inscreen-bucket');
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
    this.domRenderBtn = document.getElementById('btn-render');
    this.domTransformClone = document.getElementById('input-transform-clone');
    this.domBakeryBackFace = document.getElementById('input-bakery-backface');
    this.domAutoRotation = document.getElementById('input-autorotate');
    this.domAutoRotationCCW = document.getElementById('input-autorotate-ccw');
    this.domTexturePresets = document.getElementById('texturepresets');
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
    this.domLightLocator = document.getElementById('input-light-locator');
    this.domLightIntensity = document.getElementById('input-light-intensity');
    this.domMaterialSwitch = document.getElementById('material-switch');
    this.domProjectName = document.getElementById('input-project-name');
    this.domExportFormat = document.getElementById('input-export-format');
    this.domExportSelectedBake = document.getElementById('input-export-selbake');
    this.domOrthoBtn = document.getElementById('btn-ortho');
    this.domConfirm = document.getElementById('confirm');
    this.domConfirmBlocker = document.getElementById('confirmblocker');
    this.domNotifier = document.getElementById('notifier');
    this.domInfo = document.getElementById('info').children;
    this.domInfoParent = document.getElementById('info');
    this.domProgressBar = document.getElementById('progressbar');
    this.domLoadingScreen = document.getElementById('loadingscreen');
    const styleMenuR = '-200px';
    const styleMenuL = '-200px';
    const styleMenuR_open = '65px';
    const styleMenuL_open = '65px';
    const hoverOffset = { x: 0, y: 0 };
    let notificationTimer = null;

    this.init = function() {
        this.domMenus.addEventListener('pointerdown', (ev) => {
            if (MODE == 0) { // prevent premature usage!
                if (ev.target !== canvas && ev.target !== this.domHover) {
                    (xformer.isActive) ? xformer.apply() : xformer.cancel();
                    helper.clearOverlays();
                }
            }
        }, false);

        this.domHover.addEventListener('pointerdown', () => {
            xformer.apply();
            helper.clearOverlays();
        }, false);

        this.domColorPicker.addEventListener('input', (ev) => {
            currentColor = ev.target.value.toUpperCase();
            uix.colorPicker.value = BABYLON.Color3.FromHexString(currentColor);
        }, false);

        this.domColorPickerAlbedo.addEventListener('input', (ev) => {
            currentColorBake = ev.target.value.toUpperCase();
            bakery.setMaterial('albedo'); // update material
        }, false);

        this.domColorPickerEmissive.addEventListener('input', () => {
            bakery.setMaterial('emissive');
        }, false);

        this.domColorPickerVertexColor.addEventListener('input', (ev) => {
            (bakery.meshes.length > 0) ?
                bakery.updateVertexColors(ev.target.value) :
                ui.notification('select a mesh');
        }, false);

        this.domColorPickerBackground.addEventListener('input', (ev) => {
            scene.clearColor = BABYLON.Color4.FromHexString(ev.target.value);
            scene.autoClear = ui.domBackgroundCheck.checked;
        }, false);

        this.domColorPickerLightColor.addEventListener('input', (ev) => {
            light.updateColor(ev.target.value);
        }, false);

        this.domLightLocator.addEventListener('input', (ev) => {
            if (MODE !== 0) return;
            (ev.target.checked) ? uix.showLightLocator() : uix.hideLightLocator();
            uix.isSunLocatorActive = ev.target.checked;
        }, false);

        document.getElementById('btn-light-defaultsun').onclick = () => {
            ui.domColorPickerLightColor.value = '#EDD59E';
            light.updateColor('#EDD59E');
            if (window.pt.isActive)
                window.pt.updateUniformLightCol('#EDD59E');
        };
    }

    this.setMode = function(mode) {
        MODE = mode;

        scene.autoClear = this.domBackgroundCheck.checked;
        hdri.toggleSkybox(this.domHdriToggle.checked);

        if (scene.activeCamera.useAutoRotationBehavior)
            camera.toggleCameraAutoRotation();
        camera.switchCamera();

        if (window.pt)
            window.pt.deactivate();

        if (mode == 0) {
            if (preferences.getWebsocket()) client.ws_connect();
            scene.clearColor = BABYLON.Color4.FromHexString(this.domColorPickerBackground.value);
            builder.setMeshVisibility(true);
            bakery.setBakesVisibility(false);
            helper.displayFloorPlane(helper.isFloorPlaneActive);
            helper.displayWorkplane(helper.isWorkplaneActive);
            helper.toggleAxisPlane(symmetry.axis !== -1);
            helper.gridPlane.isVisible = true;
            uix.unbindTransformGizmo();
            light.updateShadowMap();
            uix.setLightLocator(uix.isSunLocatorActive);
            ghost.disposePointCloud();
        } else if (mode == 1) {
            //
        } else if (mode == 2) {
            client.ws_close();
            scene.clearColor = BABYLON.Color4.FromHexString(this.domColorPickerBackground.value);
            builder.setMeshVisibility(false);
            bakery.setBakesVisibility(true);
            bakery.createBakeryList();
            helper.displayFloorPlane(true);
            helper.displayWorkplane(false);
            helper.toggleAxisPlane(false);
            helper.clearOverlays();
            helper.gridPlane.isVisible = false;
            light.updateShadowMap();
            uix.hideLightLocator();
            if (preferences.getPointCloud())
                ghost.createPointCloud();
            if (bakery.meshes.length == 0)
                camera.frame();
        }

        this.setInterfaceMode(mode);
    }

    this.setInterfaceMode = function(mode) {
        this.domToolbarC_mem.children[0].innerHTML = 'SAVE';
        this.domToolbarC_mem.children[1].innerHTML = 'LOAD';
        this.domToolbarC_mem.children[3].innerHTML = 'UNDO';
        this.domToolbarC_mem.children[4].innerHTML = 'REDO';
        this.domToolbarC_mem.children[0].classList.remove("btn_select");
        this.domToolbarC_mem.children[1].classList.remove("btn_select");
        this.domToolbarC_mem.children[0].style.display = 'unset';
        this.domToolbarC_mem.children[1].style.display = 'unset';
        this.domToolbarC_mem.children[2].style.display = 'unset'; // spacer
        this.domToolbarC_mem.children[3].style.display = 'unset';
        this.domToolbarC_mem.children[4].style.display = 'unset';
        this.domPalette.style.display = 'none';
        this.domBakeryList.style.display = 'none';
        this.domHover.style.display = 'unset';
        this.domColorPicker.style.display = 'none';
        this.domInScreenBucket.style.display = 'none';
        this.domMenuInScreenRight.style.display = 'none';
        this.domMenuInScreenBottom.style.display = 'none';
        this.domMaterialSwitch.style.display = 'none';
        this.domLightLocator.disabled = true;
        uix.colorPicker.isVisible = false;
        for (const i of this.domToolbarL.children)
            i.style.display = 'unset';
        for (const i of this.domToolbarR.children)
            i.style.display = 'unset';
            
        if (mode == 0) {
            this.domPalette.style.display = 'unset';
            this.domColorPicker.style.display = 'unset';
            this.domToolbarR.children[9].style.display = 'none'; // MESHES
            this.domToolbarL.children[3].style.display = 'none'; // MATERIAL
            this.domToolbarL.children[4].style.display = 'none'; // TEXTURE
            this.domMenuInScreenRight.style.display = 'unset';
            this.domMenuInScreenBottom.style.display = 'flex';
            this.domInScreenBucket.style.display = 'unset';
            this.domMaterialSwitch.style.display = 'unset';
            this.domLightLocator.disabled = false;
            uix.colorPicker.isVisible = true;
        } else if (mode == 1) {
            this.clearAllMenus('right');
            this.domHover.style.display = 'none';
            this.domToolbarR.children[1].style.display = 'none'; // FILE
            this.domToolbarR.children[2].style.display = 'none'; // GENERATOR
            this.domToolbarR.children[3].style.display = 'none'; // VOXELIZER
            this.domToolbarR.children[4].style.display = 'none'; // SYMMETRY
            this.domToolbarR.children[5].style.display = 'none'; // MODEL
            this.domToolbarR.children[6].style.display = 'none'; // PAINT
            this.domToolbarR.children[7].style.display = 'none'; // VOXELS
            this.domToolbarR.children[8].style.display = 'none'; // BAKERY
            this.domToolbarR.children[9].style.display = 'none'; // MESHES
            this.domToolbarL.children[3].style.display = 'none'; // MATERIAL
            this.domToolbarL.children[4].style.display = 'none'; // TEXTURE
            this.domToolbarL.children[5].style.display = 'none'; // STORAGE
            this.domToolbarL.children[6].style.display = 'none'; // GROUP
            xformer.apply();
            window.pt.toggle();
        } else if (mode == 2) {
            this.domBakeryList.style.display = 'unset';
            this.domHover.style.display = 'none';
            this.domToolbarR.children[2].style.display = 'none'; // GENERATOR
            this.domToolbarR.children[3].style.display = 'none'; // VOXELIZER
            this.domToolbarR.children[4].style.display = 'none'; // SYMMETRY
            this.domToolbarR.children[5].style.display = 'none'; // MODEL
            this.domToolbarR.children[6].style.display = 'none'; // PAINT
            this.domToolbarR.children[7].style.display = 'none'; // VOXELS
            this.domToolbarL.children[5].style.display = 'none'; // STORAGE
            this.domToolbarL.children[6].style.display = 'none'; // GROUP
        }

        this.setToolbarMem(mode);

        for (const i of this.domModes)
            i.classList.remove("mode_select");
        this.domModes[mode].classList.add("mode_select");

        (scene.activeCamera.mode == BABYLON.Camera.PERSPECTIVE_CAMERA) ?
            this.domOrthoBtn.innerHTML = 'Perspective' :
            this.domOrthoBtn.innerHTML = 'Orthographic';
    }

    this.setToolbarMem = function(mode) {
        if (mode == 0) {
            this.domToolbarC_mem.children[0].onclick = () => { snapshot.setStorageVoxels() }; // SAVE
            this.domToolbarC_mem.children[1].onclick = () => { snapshot.getStorageVoxels() }; // LOAD
            this.domToolbarC_mem.children[3].onclick = () => { memory.undo() }; // UNDO
            this.domToolbarC_mem.children[4].onclick = () => { memory.redo() }; // REDO
        } else if (mode == 1) {
            this.domToolbarC_mem.children[0].onclick = () => { window.pt.fastMode() }; // SAVE
            this.domToolbarC_mem.children[1].onclick = () => { window.pt.domShade.checked = !window.pt.domShade.checked; window.pt.updateAttributeColors() }; // LOAD
            this.domToolbarC_mem.children[3].onclick = () => { window.pt.pause() }; // UNDO
            this.domToolbarC_mem.children[4].onclick = () => { window.pt.shot() }; // REDO
            this.domToolbarC_mem.children[0].innerHTML = 'FAST';
            this.domToolbarC_mem.children[1].innerHTML = 'SHADE';
            this.domToolbarC_mem.children[3].innerHTML = 'PAUSE';
            this.domToolbarC_mem.children[4].innerHTML = 'SHOT';
        } else if (mode == 2) {
            this.domToolbarC_mem.children[0].onclick = () => { snapshot.setStorageBakes() }; // SAVE
            this.domToolbarC_mem.children[1].onclick = () => { snapshot.getStorageBakes() }; // LOAD
            this.domToolbarC_mem.children[3].onclick = () => { bakery.bakeAllColors() }; // UNDO
            this.domToolbarC_mem.children[4].onclick = () => { project.exportBakes() }; // REDO
            this.domToolbarC_mem.children[3].innerHTML = 'BAKE';
            this.domToolbarC_mem.children[4].innerHTML = 'GET';
        }
    }

    this.toggleMenuAbout = function() { this.switchMenus(this.domMenusRight[0], 'right') }
    this.toggleMenuPrefs = function() { this.switchMenus(this.domMenusRight[1], 'right') }
    this.toggleMenuFile = function() { this.switchMenus(this.domMenusRight[2], 'right') }
    this.toggleMenuGenerator = function() { this.switchMenus(this.domMenusRight[3], 'right') }
    this.toggleMenuVoxelizer = function() { this.switchMenus(this.domMenusRight[4], 'right') }
    this.toggleMenuSymmetry = function() { this.switchMenus(this.domMenusRight[5], 'right') }
    this.toggleMenuModel = function() { this.switchMenus(this.domMenusRight[6], 'right') }
    this.toggleMenuPaint = function() { this.switchMenus(this.domMenusRight[7], 'right') }
    this.toggleMenuVoxels = function() { this.switchMenus(this.domMenusRight[8], 'right') }
    this.toggleMenuBakery = function() { this.switchMenus(this.domMenusRight[9], 'right') }
    this.toggleMenuMeshes = function() { this.switchMenus(this.domMenusRight[10], 'right') }
    
    this.toggleMenuPathtracer = function() { this.switchMenus(this.domMenusLeft[0], 'left') }
    this.toggleMenuCamera = function() { this.switchMenus(this.domMenusLeft[1], 'left') }
    this.toggleMenuEnv = function() { this.switchMenus(this.domMenusLeft[2], 'left') }
    this.toggleMenuMaterial = function() { this.switchMenus(this.domMenusLeft[3], 'left') }
    this.toggleMenuTexture = function() { this.switchMenus(this.domMenusLeft[4], 'left') }
    this.toggleMenuStorage = function() { this.switchMenus(this.domMenusLeft[5], 'left') }
    this.toggleMenuGroups = function() { this.switchMenus(this.domMenusLeft[6], 'left') }

    this.clearAllMenus = function(side, exclude = null) {
        if (side == 'right' || side == 'both') {
            for (let i = 0; i < this.domMenusRight.length; i++) {
                if (this.domMenusRight[i] !== exclude)
                    this.domMenusRight[i].style.marginRight = styleMenuR;
            }
        }
        if (side == 'left' || side == 'both') {
            for (let i = 0; i < this.domMenusLeft.length; i++) {
                if (this.domMenusLeft[i] !== exclude)
                    this.domMenusLeft[i].style.marginLeft = styleMenuL;
            }
        }
    }

    this.switchMenus = function(dom, side) {
        this.clearAllMenus(side, dom);
        if (side == 'right') {
            if (dom.style.marginRight === styleMenuR_open) {
                dom.style.marginRight = styleMenuR;
            } else {
                dom.style.marginRight = styleMenuR_open;
            }
        } else if (side == 'left') {
            if (dom.style.marginLeft === styleMenuL_open) {
                dom.style.marginLeft = styleMenuL;
            } else {
                dom.style.marginLeft = styleMenuL_open;
            }
        }
    }

    this.toggleHover = function(isEnabled) {
        if (isEnabled) {
            for (let i = 1; i < this.domHover.children.length; i++)
                this.domHover.children[i].style.display = 'unset';
        } else {
            for (let i = 1; i < this.domHover.children.length; i++)
                this.domHover.children[i].style.display = 'none';
        }
    }

    this.updateStatus = function() {
        this.domInfo[0].innerHTML = Math.round(engine.getFps());
        if (MODE == 0) {
            this.domInfo[1].innerHTML = builder.voxels.length + ' VOX';
            (builder.voxels.length >= MAXAMOUNT) ?
                 this.domInfo[1].style.color = 'indianred' :
                 this.domInfo[1].style.color = '#97a5b8';
            this.domInfo[2].innerHTML = palette.uniqueColors.length + ' COL';
        } else if (MODE == 1) {
            //
        } else if (MODE == 2) {
            this.domInfo[1].innerHTML = bakery.meshes.length + ' MSH';
            this.domInfo[2].innerHTML = scene.getTotalVertices() + ' VTX';
        }
    }

    this.notification = function(txt, timeout = 3000) {
        if (notificationTimer) // prevent overdraw
            clearTimeout(notificationTimer);
        this.domNotifier.innerHTML = txt.toUpperCase();
        this.domNotifier.style.display = 'unset';
        this.domNotifier.style.marginLeft = -(this.domNotifier.getBoundingClientRect().width/2) + 'px';
        notificationTimer = setTimeout(() => {
            ui.domNotifier.style.display = 'none';
        }, timeout);
    }

    let abortController = new AbortController();
    let eyeDropper = undefined;
    if (window.EyeDropper) {
        eyeDropper = new EyeDropper();
        document.getElementById('pixeleyedrop').disabled = false;
    }
    this.activateEyedropper = function() {
        if (!eyeDropper) return;
        eyeDropper.open({ signal: abortController.signal }).then(res => {
            currentColor = res.sRGBHex.toUpperCase();
            uix.colorPicker.value = BABYLON.Color3.FromHexString(currentColor);
        }).catch(err => {
            abortController.abort();
            abortController = new AbortController();
        });
    }

    this.showConfirm = async function(title) {
        ui.domConfirmBlocker.style.display = 'unset';
        ui.domConfirm.style.display = 'unset';
        ui.domConfirm.children[0].innerHTML = title;
        return new Promise((resolve) => {
            ui.domConfirm.children[1].onclick = () => {
                ui.domConfirmBlocker.style.display = 'none';
                ui.domConfirm.style.display = 'none';
                resolve(false);
            };
            ui.domConfirm.children[2].onclick = () => {
                ui.domConfirmBlocker.style.display = 'none';
                ui.domConfirm.style.display = 'none';
                resolve(true);
            };
            ui.domConfirmBlocker.onclick = () => {
                ui.domConfirmBlocker.style.display = 'none';
                ui.domConfirm.style.display = 'none';
                resolve(false);
            };
        });
    }

    this.hideInterface = function(isEnabled) {
        if (isEnabled) {
            this.clearAllMenus('both');
            this.domMenus.style.display = 'none';
            this.domHover.style.display = 'none';
            this.domPalette.style.display = 'none';
            this.domBakeryList.style.display = 'none';
            this.domColorPicker.style.display = 'none';
            this.domInScreenBucket.style.display = 'none';
            this.domMaterialSwitch.style.display = 'none';
            this.domMenuInScreenRight.style.display = 'none';
            this.domMenuInScreenBottom.style.display = 'none';
            this.domInfoParent.style.display = 'none';
        } else {
            this.domMenus.style.display = 'unset';
            if (MODE == 0) {
                this.domHover.style.display = 'unset';
                this.domPalette.style.display = 'unset';
                this.domColorPicker.style.display = 'unset';
                this.domInScreenBucket.style.display = 'unset';
                this.domMaterialSwitch.style.display = 'unset';
                this.domMenuInScreenRight.style.display = 'unset';
                this.domMenuInScreenBottom.style.display = 'flex';
                palette.create();
            }
            if (MODE == 2) {
                this.domBakeryList.style.display = 'unset';
            }
            this.domInfoParent.style.display = 'unset';
        }
    }

    this.toggleDebugMode = function() {
        if (scene.debugLayer.isVisible()) {
            this.hideInterface(false);
            scene.debugLayer.hide();
        } else {
            this.hideInterface(true);
            scene.debugLayer.show({
                embedMode: false,
                additionalNodes: [
                    {
                        name: "Baked Meshes",
                        getContent: () => bakery.meshes
                    }
                ]
            });
        }
    }

    this.dragElement = function(elem) {
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
                initialX = e.touches[0].clientX - hoverOffset.x;
                initialY = e.touches[0].clientY - hoverOffset.y;
            } else {
                initialX = e.clientX - hoverOffset.x;
                initialY = e.clientY - hoverOffset.y;
            }
            if (e.target === elem) active = true;
        }

        function dragEnd(e) {
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
                hoverOffset.x = currentX;
                hoverOffset.y = currentY;
                setTranslate(currentX, currentY, elem.parentElement);
            }
        }
        
        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate(" + xPos + "px, " + yPos + "px)";
        }
    }

    this.hoverTranslate = function(elem, x, y) {
        elem.style.transform = "translate(" + x + "px, " + y + "px)";
        hoverOffset.x = 0;
        hoverOffset.y = 0;
    }

    this.init();
}


// -------------------------------------------------------
// UserInterfaceAdvanced


function UserInterfaceAdvanced(scene) {
    this.advancedTexture = null;
    this.utilLayer = null;
    this.colorPicker = undefined;
    this.gizmo = null;
    this.gizmoVoxel = null;
    this.sunNode = null;
    this.sunGizmoUp = null;
    this.sunGizmoNews = null;
    this.isSunLocatorActive = null;

    this.init = function() {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", {}, scene);
        this.utilLayer = new BABYLON.UtilityLayerRenderer(scene);
        this.utilLayer.utilityLayerScene.autoClearDepthAndStencil = true;

        this.createAdvancedColorPicker();
        this.initLightLocator();
    }

    this.createAdvancedColorPicker = function() {
        const panel = new BABYLON.GUI.StackPanel();
        panel.width = "115px";
        panel.height = "105px";
        panel.isVertical = true;
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.advancedTexture.addControl(panel);  

        this.colorPicker = new BABYLON.GUI.ColorPicker();
        this.colorPicker.value = BABYLON.Color3.FromHexString(currentColor);
        this.colorPicker.height = "100px";
        this.colorPicker.width = "100px";
        this.colorPicker.paddingBottom = "3px";
        this.colorPicker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.colorPicker.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
        this.colorPicker.onValueChangedObservable.add((color3) => {
            currentColor = color3.toHexString();
            ui.domColorPicker.value = currentColor;
        });
        panel.addControl(this.colorPicker);
    }

    this.bindVoxelGizmo = function(mesh) {
        this.unbindVoxelGizmo();
        this.gizmoVoxel = new BABYLON.GizmoManager(scene, 5, new BABYLON.UtilityLayerRenderer(scene));
        this.gizmoVoxel.positionGizmoEnabled = true;
        this.gizmoVoxel.rotationGizmoEnabled = false;
        this.gizmoVoxel.scaleGizmoEnabled = false;
        this.gizmoVoxel.usePointerToAttachGizmos = false;
        this.gizmoVoxel.clearGizmoOnEmptyPointerEvent = true;

        this.gizmoVoxel.gizmos.positionGizmo.scaleRatio = 0.5;
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

    this.unbindVoxelGizmo = function() {
        if (this.gizmoVoxel)
            this.gizmoVoxel.dispose();
        this.gizmoVoxel = null;
    }

    this.bindTransformGizmo = function(meshes) {
        this.unbindTransformGizmo();
        if (meshes.length == 0) return;

        this.gizmo = new BABYLON.GizmoManager(scene, 5, new BABYLON.UtilityLayerRenderer(scene));
        this.gizmo.positionGizmoEnabled = true;
        this.gizmo.rotationGizmoEnabled = true;
        this.gizmo.scaleGizmoEnabled = false;
        this.gizmo.usePointerToAttachGizmos = true;
        this.gizmo.clearGizmoOnEmptyPointerEvent = true;

        this.gizmo.gizmos.positionGizmo.scaleRatio = 0.5;
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
        
        this.gizmo.gizmos.rotationGizmo.scaleRatio = 0.25;
        this.gizmo.gizmos.rotationGizmo.snapDistance = Math.PI / 8;
        this.gizmo.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = false;
        [ this.gizmo.gizmos.rotationGizmo.xGizmo,
          this.gizmo.gizmos.rotationGizmo.yGizmo,
          this.gizmo.gizmos.rotationGizmo.zGizmo ].forEach((gizmo) => {
                gizmo.dragBehavior.onDragObservable.add(() => {
                    light.updateShadowMap();
                });
            });

        this.gizmo.attachableMeshes = meshes;
        this.gizmo.onAttachedToMeshObservable.add((mesh) => {
            (mesh) ? bakery.onGizmoAttached(mesh) : bakery.deselectMesh();
        });
    }

    this.unbindTransformGizmo = function() {
        if (this.gizmo)
            this.gizmo.dispose();
        this.gizmo = null;
    }

    this.initLightLocator = function() {
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
            light.updateHeight(light.location.y / uix.sunNode.scaling.x);
        });

        this.sunGizmoNews = new BABYLON.PlaneRotationGizmo(BABYLON.Axis.Y, COL_AQUA_RGB, this.utilLayer);
        this.sunGizmoNews.scaleRatio = 0.7;
        this.sunGizmoNews.attachedMesh = null;
        this.sunGizmoNews.updateGizmoRotationToMatchAttachedMesh = false;
        this.sunGizmoNews.dragBehavior.onDragObservable.add(() => {
            light.updateAngle(uix.sunNode.rotation.y * 180 / Math.PI);
        });
    }

    this.showLightLocator = function() {
        this.sunGizmoUp.attachedMesh = this.sunNode;
        this.sunGizmoNews.attachedMesh = this.sunNode;
        ui.domInScreenLightLocator.firstChild.style.color = COL_ORANGE;
        ui.domLightLocator.checked = true;
    }

    this.hideLightLocator = function() {
        this.sunGizmoUp.attachedMesh = null;
        this.sunGizmoNews.attachedMesh = null;
        ui.domInScreenLightLocator.firstChild.style.color = COL_AQUA;
        ui.domLightLocator.checked = false;
    }

    this.setLightLocator = function(isEnabled) {
        (isEnabled) ? this.showLightLocator() : this.hideLightLocator();
    }

    this.toggleLightLocator = function() {
        if (this.sunGizmoUp.attachedMesh) {
            this.hideLightLocator();
            this.isSunLocatorActive = false;
        } else {
            this.showLightLocator();
            this.isSunLocatorActive = true;
        }
    }

    this.init();
}


// -------------------------------------------------------
// Preferences


function Preferences() {
    const KEY_STARTUP = "pref_startup";
    const KEY_NOHOVER = "pref_nohover";
    const KEY_WEBSOCKET = "pref_websocket";
    const KEY_WEBSOCKET_URL = "pref_websocket_url";
    const KEY_PALETTE_SIZE = "pref_palette_size";
    const KEY_BVHPICKING = "pref_bvhpicking";
    const KEY_POINTCLOUD = "pref_pointcloud";

    this.init = function() {
        document.getElementById(KEY_STARTUP).checked = false;
        document.getElementById(KEY_NOHOVER).checked = false;
        document.getElementById(KEY_WEBSOCKET).checked = false;
        document.getElementById(KEY_WEBSOCKET_URL).value = "localhost:8011";
        document.getElementById(KEY_PALETTE_SIZE).value = 1;
        document.getElementById(KEY_BVHPICKING).checked = true;
        document.getElementById(KEY_POINTCLOUD).checked = true;

        initPrefCheck(KEY_STARTUP);
        initPrefCheck(KEY_NOHOVER);
        initPrefCheck(KEY_WEBSOCKET, (chk) => {
            (chk && MODE == 0) ? client.ws_connect() : client.ws_close();
        });
        initPref(KEY_WEBSOCKET_URL);
        initPref(KEY_PALETTE_SIZE);
        initPrefCheck(KEY_BVHPICKING, (chk) => {
            if (chk && MODE == 0) window.rc.create();
        });
        initPrefCheck(KEY_POINTCLOUD, (chk) => {
            (chk && MODE == 2) ? ghost.createPointCloud() : ghost.disposePointCloud();
        });
    }

    this.finish = function() {
        setTimeout(() => {
            palette.expand(this.getPaletteSize());
            ui.toggleHover(!this.getNoHover());
        }, 100);

        const scriptModules = document.createElement('script');
        scriptModules.type = 'module';
        scriptModules.src = 'src/modules.js';
        document.body.appendChild(scriptModules);

        // inject the user modules entry point
        const scriptUserModules = document.createElement('script');
        scriptUserModules.type = 'module';
        scriptUserModules.src = 'user/user.js';
        document.body.appendChild(scriptUserModules);

        const interval = setInterval(() => {
            if (window.rc) {
                if (this.getStartup()) {
                    project.loadFromUrl('user/startup.json', () => {
                        window.rc.create();
                    });
                } else {
                    project.newProject(false, '#618ABD');
                    window.rc.create();
                }
                ui.hideInterface(false);
                engine.hideLoadingUI();
                console.log('initialized.');
                clearInterval(interval);
            }
        }, 500);
    }

    this.setStartup = function(isEnabled) {
        localStorage.setItem(KEY_STARTUP, isEnabled);
    }

    this.getStartup = function() {
        return document.getElementById(KEY_STARTUP).checked;
    }

    this.getNoHover = function() {
        return document.getElementById(KEY_NOHOVER).checked;
    }

    this.setNoHover = function(isEnabled) {
        document.getElementById(KEY_NOHOVER).checked = isEnabled;
        localStorage.setItem(KEY_NOHOVER, isEnabled);
        ui.toggleHover(!isEnabled);
    }

    this.getWebsocket = function() {
        return document.getElementById(KEY_WEBSOCKET).checked;
    }

    this.getWebsocketUrl = function() {
        return document.getElementById(KEY_WEBSOCKET_URL).value;
    }

    this.getPaletteSize = function() {
        return document.getElementById(KEY_PALETTE_SIZE).value;
    }

    this.setBvhPicking = function(isEnabled) {
        localStorage.setItem(KEY_BVHPICKING, isEnabled);
    }

    this.getBvhPicking = function() {
        return document.getElementById(KEY_BVHPICKING).checked;
    }

    this.setPointCloud = function(isEnabled) {
        localStorage.setItem(KEY_POINTCLOUD, isEnabled);
    }

    this.getPointCloud = function() {
        return document.getElementById(KEY_POINTCLOUD).checked;
    }

    function initPref(key, callback = undefined) {
        if (localStorage.getItem(key)) {
            document.getElementById(key).value = localStorage.getItem(key);
        }
        document.getElementById(key).addEventListener("input", (ev) => {
            localStorage.setItem(key, ev.target.value);
            if (callback) callback(ev.target.value);
        }, false);
    }

    function initPrefCheck(key, callback = undefined) {
        if (localStorage.getItem(key)) {
            document.getElementById(key).checked = parseBool(localStorage.getItem(key));
        }
        document.getElementById(key).addEventListener("input", (ev) => {
            localStorage.setItem(key, ev.target.checked);
            if (callback) callback(ev.target.checked);
        }, false);
    }
}


// -------------------------------------------------------
// Events


scene.onPointerObservable.add((pInfo) => {
    switch (pInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
            if (pInfo.event.button > 0) return;
            if (MODE == 0) tool.handleToolDown(pInfo.pickInfo);
            else if (MODE == 2) uix.bindTransformGizmo(bakery.meshes);
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
    if (ev.key == '/') ui.toggleDebugMode();
    if (scene.debugLayer.isVisible()) return;

    if (MODE == 0 && !tool.last && !tool.isMouseDown) {
        if (ev.altKey) {
            tool.last = tool.name;
            tool.toolSelector('camera');
            return;
        }
    }
    
    switch (ev.key.toLowerCase()) {
        case 'enter':
            if (ev.target instanceof HTMLButtonElement) return;
            if (MODE == 0)
                xformer.apply();
            break;
        case ' ':
            if (MODE == 0) tool.toolSelector('camera');
            break;
        case '`':
            if (MODE == 0) tool.toolSelector('camera');
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
            if (MODE == 0) tool.toolSelector('box_rem', true);
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
        case 's':
            if (MODE == 0) symmetry.switchAxis();
            break;
        case 'c':
            if (MODE == 2) bakery.cloneSelected();
            break;
        case 'delete':
            if (MODE == 2) bakery.deleteSelected();
            break;
        case 'f':
            (window.pt.isActive()) ?
                window.pt.frameCamera() : camera.frame();
            break;
        case 'o':
            camera.switchOrtho();
            break;
        case 'r':
            (window.pt && window.pt.isActive()) ? ui.setMode(0) : ui.setMode(1);
            break;
    }

    if (ev.ctrlKey && ev.key.toLowerCase() === 'l')
        document.getElementById('openfile_json').click();
    
    if (MODE == 0) {
        if (ev.ctrlKey && ev.key.toLowerCase() === 'z') {
            xformer.apply();
            ev.preventDefault();
            memory.undo();
        }
        if (ev.ctrlKey && ev.key.toLowerCase() === 'x') {
            xformer.apply();
            ev.preventDefault();
            memory.redo();
        }
    }
}, false);

document.addEventListener("keyup", (ev) => {
    if (tool.last) {
        tool.toolSelector(tool.last);
        tool.last = null;
    }
}, false);

function fileHandler(file) {
    const ext = file.name.split('.').pop().toLowerCase(); //ext|exts
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = () => {
        if (ext === 'json' || ext === 'vbx') project.load(reader.result);
        if (ext === 'obj') if (MODE == 0) voxelizer.importMeshOBJ(url);
        if (ext === 'glb') if (MODE == 0) voxelizer.importMeshGLB(url);
        if (ext === 'vox') project.loadMagicaVoxel(reader.result);
        if (ext === 'hdr') hdri.loadHDR(url);
        if (MODE == 0) {
            if (['jpg','png','svg'].includes(ext)) voxelizer.voxelize2D(reader.result);
        } else if (MODE == 2) {
            if (['jpg','png'].includes(ext)) material.addTexture(reader.result);
        }
        URL.revokeObjectURL(url);
    }
    if (ext === 'json' || ext === 'vbx') {
        reader.readAsText(file);
    } else if (ext === 'vox') {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsDataURL(file);
    }
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

window.addEventListener("resize", () => {
    engine.resize(true);
    renderPickTarget.resize({ width: engine.getRenderWidth(), height: engine.getRenderHeight() });
    
    material.updateCelMaterial();

    updateAxisViewViewport();

    if (MODE == 0)
        palette.create();

    if (MODE == 2)
        bakery.createBakeryList();

    if (isOffScreen(ui.domHover))
        ui.hoverTranslate(ui.domHover, 0, 0);
}, false);


// -------------------------------------------------------
// Websocket Client


function WebsocketClient() {
    let socket = null;
    let timeout = null;

    this.ws_connect = function() {
        try {
            socket = new WebSocket("ws://" + preferences.getWebsocketUrl());
        } catch (err) {
            ui.notification("invalid websocket address");
            return;
        }
        
        socket.onopen = () => {
            if (MODE == 0)
                socket.send(JSON.stringify({ voxels: builder.voxels }));
        }

        socket.onmessage = (msg) => {
            if (MODE == 0)
                builder.setDataFromArray(JSON.parse(msg.data).voxels);
        }

        socket.onclose = () => {
            console.clear();
            clearTimeout(timeout);
            if (preferences.getWebsocket())
                timeout = setTimeout(client.ws_connect, 3000);
        }
    }

    this.ws_send = function(voxels) {
        if (socket && socket.readyState == WebSocket.OPEN)
            socket.send(JSON.stringify({ voxels: voxels }));
    }

    this.ws_close = function() {
        clearTimeout(timeout);
        socket = null;
    }
}


// -------------------------------------------------------
// Utils


function clearScene() {
    memory.clear();
    symmetry.resetAxis();
    setTimeout(() => {
        camera.frame();
    }, 10);
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

function updateAxisViewViewport() {
    sceneAxisView.activeCamera.viewport = updateViewport(100, 100, 5, -5);
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
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    engine.setSize(canvasWidth * scale, canvasHeight * scale);
    isRenderAxisView = false;
    helper.gridPlane.isVisible = false;
    uix.colorPicker.isVisible = false;
    BABYLON.ScreenshotTools.CreateScreenshotWithResizeAsync(engine,
        scene.activeCamera, canvasWidth * scale, canvasHeight * scale).then(() => {
            isRenderAxisView = true;
            helper.gridPlane.isVisible = true;
            uix.colorPicker.isVisible = (MODE == 0);
            engine.setSize(canvasWidth, canvasHeight);
    });
}

function createScreenshotBasic(width, height, callback) {
    isRenderAxisView = false;
    helper.gridPlane.isVisible = false;
    uix.colorPicker.isVisible = false;
    BABYLON.ScreenshotTools.CreateScreenshot(engine,
        scene.activeCamera, { width: width, height: height }, (data) => {
            isRenderAxisView = true;
            helper.gridPlane.isVisible = true;
            uix.colorPicker.isVisible = (MODE == 0);
            callback(data);
    });
}

function clearCache() {
    engine.clearInternalTexturesCache();
    scene.cleanCachedTextureBuffer();
    BABYLON.Tools.ClearLogCache();
    memory.clear();
    ui.notification('cleared cache and memory');
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
