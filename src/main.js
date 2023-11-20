/*
    Aug 2019
    @nimadez

    [ Code Map ]
    01. Initialize
    02. Scene
    03. Camera
    04. Light
    05. HDRI and Skybox
    06. Pipeline (post-process)
    07. Material
    08. Builder (SPS particles)
    09. Palette (color palette)
    10. Helper (overlays)
    11. Tool, ToolBakery
    12. Symmetry
    13. Voxelizer
    14. Generator
    15. Bakery
    16. Snapshot
    17. Memory
    18. Project
    19. UserInterface
    20. UserInterfaceAdvanced
    21. Preferences
    22. Events
    23. Websocket
    24. Utils
*/

const ENVMAP = "assets/snow_field_2_puresky_1k.hdr";
const PARTICLE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wgaExY5fZXYlgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAASFUlEQVR42u1bS48bR5KOR2ZV8dHsh97WeD2Y82IxEI996YMAw/9jftb8j8ECPVgBgz74QP+AgS0YMNAtW61+kyxWZkbsIbPIYrHYLcmaxQK7BFJksyiy4osvIiPjAfD/j//bD/ySX/aXv/wFW9+LD6zmQxvP9y3461//qv+rAGgJXi96YDVBaAoo96z6OnwpMPALCl4Lxem1Sa9N6zWn1WZBLWQAAN94br6ur0sTtN8DAn4hjVNDMNtYWWvZw/HYQrHDvZ5h8IBgADx4BQ/inPNlWfrJZOIAwAFA1XiuXzdBCb8XCPwdwjfpbJLAeVoFABRjgN7O0VGR93qFZVswY27IZMhoAMEg4NIEFDSogBcJVQihEucWpXPl5eW8nExO5gBQprVIqwYptEzkk8wCP0N4bFDdNDTdS2tweHg4GI6GwyIrBsbagWHuE1GPiQogyhAxIwRGQEp3KqoaVNWpqhORUkTKEPxcJEzdwk1nZTm9PD6eTgCmADADgHkComowogbio0HAzxCeGlSvBe8DwPDo8Gg03B+OcpuPTGZGhs0OMw+JaYCEPSIuECAnjAyAyAAEAFHQAAJeQSsRXajKXCTMQpBp8OHOeXfjnLspp+XNf16e38JkcgsrMGog1sziY0DAzxDeJMHzJPjOeHw4evFitJ/n/b3M2n02Zt8Ys8tEO0g8JMI+EfUQMUdECwAGERkBUREAVFUVBEB9YkGlqqWqzIPoVEK4CyFce++vnXNXVbW4nE5nV8fHx1cAcAsAd4kRVcMsPgoE/AThuSF8DwAGALD7+vXr/cFg56Ao8kfWmsfGmANm3mPmXSIaEtEAEQsiyhHRYtQ8AwAhIAFG+WsPr6BeRb2qViJSqupcRO5CCLchhOsQwqV37sPCVR8W5eLD2dnlxWRycg0ANw021M7yQRDwE4XPk/A7Y4C9p99992gw6D/JsvyJtfaJYfOIDR8w8S4S7TBTn4gKQMgIySKiAQBGREKA5AMVQUE17fGquuYPVHQhKvMQwp2I3obgr0IIH7xz55Vz78v5/P31zc35mzdvLgDgOplF+bEg4EfSvrb3PgCMxoeHBy/29x/3er1neZ4/s9Y+ZeYnxpgDIt5jpiFRFB4RLSFZQGBCJEAkROyMBGsmJBBEVbyIOlWpRHQuItPEhMsEwm8L535dlOWvt7e3vx0fH38AgKtkEmXDL2x1jOYTbD4KPz48ePno0dNer/c8y7IX1trnxpinzHxgmPeIeUhEfUTMicgSESMiQ9I6IiIg1tI3I0GI8kcg4oOESIOIOEIpAlKPkHoUTaqIPoUyQjRARK9fv8bj4+PO8LkRQa49+IF9vmnzo/F4fPDi5bNn/V7/RZ7nL7M8e2mNfWGMeWqtfcTMu8w8ZOYeM+dEZJnIIDEzERERxn8RiRDT30jxD4zvE+HqQYjIiMhIZBAxLiIb/QmadA0JAMgY/cPLl+Ht27fS2BGWUeOrV6/ghx9+uB+AV69e1dqv9/geAAwBYH88/vPTQX/4VZ5lL22WvTTWvjDWPEmOb5eZ+8xcMHPGRIZqsVfCR6kiBIgtSZeyE0L9SYisIYhvcVq1L0nPQIQICCiGSJ49f+5//vln3xUktUEwD+z1S+1/9+13B0Vv8DTLsufGZi+MNc+N4SfMZp+Jdpi5IKKMiAwhEq6EjSJESQBT8IeIbQ8Q1RStAFUVVBUQEVQVURAFdYkXABAgkAGDAKCgIKoQVNWPRrtuPB67yWTSBYJuZUDSftvud4+Ojh7t7u0+L4reyyzLXlobac+GDzgGOz0iyonIEBEnzSMz1xQHIoKoWQJEjH8nQBARID0T4dr7tcSw2jZWrABIThUoBVUKAAGRQp7n7p///Gc7XN4wBfOA9vswhtFoNDrIsuxJZuxTY8wTZn7EzHtMPGSiHhFlzGSImFYU7xByyYLuDSg5Qai131yogAKa3OjSiRbxP7AwQ9o6oVKVMoRi/vr16/nx8XHZCpCkyQLu0D43orzdb//j28eDweB5ludfWWu/MsY8N8Y8MswjMqbPRDkxGSamhlMDYoZa80sGNEDZDs72BUtjAlSorQobJ1NV1Xh0VoAKARbD4XBxdnbm2hFizQJzT5zfG48Ph0XR38sy+8gwPzKGD5YRHlOPo80zEy9dd1PYpqDwgA9oaj/Z/cYCABARRCRlBlrtnlqoamA2uyK6EOFZZsytz7Lbx48f36XgaN7FAm5pnxqOb/fPf/73R4NB8SzLiq+Wds+8b4zZYeaCiQ0l1a/ZehK8DUQ3C6Ly7mcDtEHDVjC3llhRjYcqUChFZT4cDsuzs7NFOzB69erV2i6wHvKOx/0sy0bGZHuN2H6HiPqEmCGSQcJa+C0CIiBSS5Dk8Bo/W8vV1v7qQUCkICJASFFNAKgKgKhERKyqVlULIhow00gC77E1e5m1u/v7jy+TUmcJBKpBMB2ZHQsAxdHOft/abIeZR8Q0IsKdFN7mSGRTTIMNT32vjW9oOKp0zQRq4WttqyqoyDKEi2GBAMpyx0AAAlUlJDIoYik65QExjTjQyNpsVBT5MDnMrJGyQwBQ6mCABYB8OLR9a3jIzDuMNCTiKDwuw1taBTG0XWAiwC6/0Pr8NtOJn0vX1r537TXGwJJMikV6kQm8w8zDPLeDw8PDXgLANJOyppXUZACwYxgXbLM+MQ+IeBifqUDEDAlNI2Jd3kxkdn1TDWE3tB8p394K2wxoPogARNZ9AylFv4+KhASKWkeKFhFzXDFhQMYMhr1hFwDQCcDOUZFbMj0m7hNBDxGLOplB7RgWCRAQENZt/YHtbGMX2BAe148vbeeoqC3Q184OlgmLQBiZQNSzhS0eYsDSCeb5MGND6cRFBRHlAGAofjnhalNeJrUeEroLBIDoDBXWBUdFEJUGQWp2bP0NREStASAkI0CW4r0XTNRj5rwFAAFAoDVXmwAgshmhyZAwxzqTQ2Tqszw24o9t2l2uewIcomg+a/4BI7UR2maDnVtm4zexETYbJLSImCVzyIkoPzw8tO26RNcuYKwlg4QZImaYChuUMjm12poCNm15g+ZbGYCAHekY1foHNn1D/L+aPrNpHomKlO7TAIBFxIwIM2a21lrTLsp0AUDLc/dqUTOhsSlgGxDotPVuM4COEiG2hIfNLbL7jFH7V0IAQopHZ4QohzGGG/TfOA6vQKAlEOu1vPVIrFuClsBdr9ffw/YJdSMWQIQ1++/aKTa+GDEmXQEYARmAGHizLkkdOUKkmI5YfrCp2I8rNmCHoCt81vxABxu2s+P+3C52X0BI4QQDtz+CbQBgvFneBv3kipvec6V1CAJ9WKMPyp8OUvfjpiGEzRij/aEJgIKIKKgoaDuLop8kvq5Tepn56TjldZnAx77fcXdr5XZVFQFRAN6Qx7S+RgFAgkJQhQCylliUeAOrxNWmOldprFq72HBoS3pra+9vJUGa39UWfO11t/QxoQyxvgAAAWpZ/ELa2WLTFh4AAogGUPUaS1UhrQRC4x6hpc2Gs9g43KStTes9TB/IBHVca4MVQVptn3UyHQAk5gjVq6gTEKcqzrtlEbUTgGVzggvOiUiVanRVA4jlb9xH35Xnbnhz0JVJJGao6hoW25IgbYDuMQ1NDBAAiHVG0EpFq6BS3cKtb+cH2yYQAXCu0hAWolKq6iIB4VU1RKWrqip23XQtWLysAF3b1mqrXzOELgC2AbK+msUUFVX1oupAdSGipaiWwYVqcjJxjU6TrQxw8/l84Xd3SwkyT7X6BZA6VQ21Y0w/CqqrFHY0g6jplZ0IaNPXag3KWshwb0I00Xs7KCpNBEKkviwkVZglhLlzruwqoVPLBwQAcCcnJwvn3SxImInKTEXnEpngRCRIrNt9lMZUFFQlJjZElk5ENf2dlqounzfXA7+1qqcFEVlWlkVkJiIzH/ysAcDDDACA0lVuLiFMNeidsEw1FicrIvIqYhRRN7S/RlNZ7rIiKQBqOchtSdEmE7aDsgRHRURFREQlqKoT1VJEZyoy9SHcBR+ml5eX8w4ANnyAJAAW8/l82u8Pbq31Nyx8GyRMSWmuqoWIWiLlmKHFNTMQESCiKDTpZqBxT+ID4GG6twBJm0GqJktsr1GRmUi48yI3IYRb59x0Mpl0AQDUtQsAQPnmzZuZc9Vt8P4mhHAjIrciMpMQSlVxIhJUVURENWpgReUl/ddp3qR6UxCR+r1ujUstuOja/0+rfvi0c6VeArkOwV97567v7spmB0noMoEmCD59cDabzW6zLL8yNlyGEPaIaESEPRTJsU6OQKzZUeNmSQQk5fe6tF+f99ssuN8RRv8hDe3X1FdVLyKViMyDyF0QuQ4hXHnnr6qqunnz5rjdL7BsmqBW40ATgPnx8eWtc9W18/4yhHApQa5CSEyIP+iT9YnULAhhQ9Mbjk42r20sbX9HZEpilUa5VUQkiIgTkbmI3IlPbTTeXzjnLmazWbNrpBkIQRcDtOEI5wCTu+l0/8pau2OId4hpgAF7iJTXeYKUHDDL4yURisg9pS5IMQLcG+93275AtLil4wsi4kIIZeoeuQ4SLoL3586587KqLo+Pj28a9QD/UG2wfZSkt2/f8jd/+hNbYywjWYhpJlPX5ht5g41cyLaTizbjBNi2dW46vqTzWngfQqh7Cu9S28x77927qnKnZVW++3B1/f6Xn3++TJ1kdfOUNHuGlgD88MMP8OrVq66yEz178oSyImMiNtzo1IDY6kbrIGjz+NxVAq737Xv29VYMIJqOdBJ3PZUQQqhiM2W4CyFchRDOvfe/OudOF4vF2d3t3a//9fe/f2h0jzXtf1ke7+oP2Ego/PLLL/D1H75Gaw2vta0kwXE9y1KHyG0gNw45m5pv2X0Uetk1ldxNSP6nDCFMQwhX3vtz7/2v3rvTxcKdzmazd3/729/OU8PUNGnft7W/AUCDBRun7bdv3+Ifv/63uuxdt33QlhmAhsC6pPna+9qgfyNCTHRPB1pRXWpeQtrqFrXD8yFchiR81Hx1Wpbzs9OL0/dnv5zV1C+bpfF2p9hGj9AWEAAA9MeffoJvvvlGOXV7NAweoTPDq0s5oXmA2MqA5fYGDUdXb3MuCT8TkdsQ/GWT9tVicTqfz9+dn5+///7k+4sk/Hwb9bcC0DKF9hSH/Pjjj5pAECRaDTEoaqzXLlMZUh/a66AN1k9tqwsrhq+IvtJ4ley97hi99iFc+ODfe+/fOefOqqo6nc9nZ+fXH347+cdJl93LtmbJTgDuMYUahPD1118HIoonK8SAAEEV/CoLo6KgITnvsGp+jMK2/pZ0kAki6lOkWYnIIm1xdyGEW+9Tl6j3773z76qqOquq8nQ+L88+fPjw/uQfJxct4f026t8LQAcI7ZGW8NNPP4WXL196IvCq6ADUQUxAxCXqFMCpqgMAL7LMMHmNmg0i6uISJyIuneIWjZPcNIRwE728XIQQzr1zv4bgzypXnS0W5dl8Xr47PT09//777y86+oVlG/U/p1m6ORhRpGbpncPDw939/f2DoigOsix7ZIzZZ+Z9Zt5l4h2i1CofS1Sx0oRoGp1dAOt9wjGTszzP60yC3AXxNyHItfPuwrtwUVbzD9Pb6UXqGL/u6Bj/qNmBz2mX58Z0SN01Pnr97etRvxjs5Vm2Z43dY2t2mXnERENC7CNRj5ByJMgA0CAgA9aHsUZzU90uL1pKnBm4C0HuvA/Xwftr593VbDG7ujn77epkMrlJgk9bwxMfPTjxOQMT7db5BhDjnW+/fbxT5MWOzezIGDNk5iETD4gpltkJcwSyiMtOjWU6btkhrroIIQ5MSJBp8O6u8v7WufLm8u7m9uTNST0jMGuM0bTniOCLDUzcMy/UHJIq0uoDQP/o9dFgWAz7bO3AMPUMmx4SFYSUEYFFRKOAGCvfdYs8+NQZvvAhlEFkHhZutnCL2fn53XQyOZk1xmXK1mzAZ80N/Z6hKdwCRNYcnIIxFEc7R3me57m1NqfU6EwUu8viEVQEBEQk+BDABecqF9zicj5fTE5OmsNSZWuCbKMh+lMnxz57brBlEtiouzeHqWpAmqN0BgDMeDymoiioLMtYkZqAAEzqhIy7Z7X7fz9rWuxfMTiJHazgjoFJbk2PbhZmNld7aHKtxPU/Pjj5kUBsG6HFlvDQAYJC98jsF58h/lcNT0PH4ei+wek2CLBl6uOLD0//NxKXqwa3BaHgAAAAAElFTkSuQmCC";
const SNAPSHOT = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 90%22><text x=%220.18em%22 y=%221.1em%22 font-size=%2260%22 style="filter: grayscale(); opacity: 0.13;">❌</text></svg>';
const TEX_PATTERNS = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4ODg4NzQ1MjgxNEExMUVEQjVDQTlGMzY0ODY0NzdERiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4ODg4NzQ1MzgxNEExMUVEQjVDQTlGMzY0ODY0NzdERiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg4ODg3NDUwODE0QTExRURCNUNBOUYzNjQ4NjQ3N0RGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg4ODg3NDUxODE0QTExRURCNUNBOUYzNjQ4NjQ3N0RGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+xCfx0wAAAAZQTFRF////AAAAVcLTfgAAAA5JREFUeNpiYAABgAADAAAGAAHgQhFOAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAADwCAMAAACg0xNxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MURGNUY4RDQ4MTRBMTFFRDg1OTZGOUQyMjQ2RDM0M0IiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MURGNUY4RDM4MTRBMTFFRDg1OTZGOUQyMjQ2RDM0M0IiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFlZjEwNWVjLTQxZTMtZDQ0NS04NjUzLTA4NTlhYmMzMmY4NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Mp3ODAAAABlBMVEXu7u7///8o06qaAAAAaElEQVR42uzZMQ0AAAjAMPBvGgc8cJDQCaiBRbws9wICgUAgEAgEAoFAIBAIBAKBQCAQOAflpwCBQCAQCAQCgUAgEAgEAoFAIBAI7EH5KUAgEAgEAoFAIBAIBAKBQCAQCAQCe/B2JcAAIghB7N/vJckAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAADwCAMAAACg0xNxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUE0MjE1NEY4MTRBMTFFRDgwMkJFMDA0NDAyMEZBMjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUE0MjE1NEU4MTRBMTFFRDgwMkJFMDA0NDAyMEZBMjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNzA3OTRhLTljOTgtNzM0ZC04MjgxLTZkNjBjOTljYTM5ZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5nAPaYAAAAD1BMVEX6+vrw8PDv7+/u7u7////hEbC4AAAAhElEQVR42uzZsQ3AIAxFQRPYf2aUDSw5RcD3a+tq0Iv58eIIcCU2UlcLCAQCgUAgEAgEvu/sxJ7UVfgFAIFAIBAIBAKBPcGGtUJPAQKBQCAQCAQCu4F6ChAIBAKBQCAQCCyC8oeeAgQCgUAgEAgEXg/qKUAgEAgEAoFAILAI/jsubAEGAJbMGzlAxOE3AAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAADwCAMAAACg0xNxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkJEOEMzNzI4MTRBMTFFRDg4QTJGODA0OTc0NEY4OEQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkJEOEMzNzE4MTRBMTFFRDg4QTJGODA0OTc0NEY4OEQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmM0YmQ5NDcyLWM2YWEtNjc0ZC05ODMzLTZjOGE1ZDhhYTg3MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Wa8daAAAACVBMVEXu7u7////19fVT5JFBAAAAc0lEQVR42uzZsREAMAgDMWD/oVnBTYokcs2JAb7qy02yjgYEAoFAIBAIBAJPgNFp9HWAQCAQCAQCgUDgFaDpKUAgEAgEAoFAIFBPAQKBQCAQCAQCgXqKngIEAoFAIBAIBAL1FCAQCAQCgUAgEPhuT1kBBgAiG2LjsAHS6QAAAABJRU5ErkJggg==",
];
const TEX_PRESETS = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAMAAAAvgQplAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDc0OUI1NzM1RkYxMTFFRDlENDNDMTVFMEE4NDM4N0QiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDc0OUI1NzI1RkYxMTFFRDlENDNDMTVFMEE4NDM4N0QiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY2MjA4ZTcyLWY5NzctNDM0Mi05MDk0LTdkYWQwOTU3NDk2ZCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6/aB5VAAAAeFBMVEVvr0VhoTdoqD5pqT9trUNqqkB1tUtiojiHh4eKuVpsbGxrq0F0tEqDslN0WESQv2CTwmOcy2ySwWJ/v1VgoDaNvF1QkCaXxmdkpDqBsFFwsEZxsUdXly1mpjxnpz1fnzVzs0l+vlR2tkxsrEK5hVxZPSmWbEp5VTrV5Zr8AAABOElEQVR42tSPaXLDIAyFBXbiLE6T7iugxYL737ASzrS5QH907NEgwfveE4wkQ94wSYGUkDMcWQJaO8UBZS9bmBkkQRHiTR4Cj7AV5FOIXIgxSGYYGQZxBgIzcgTKZAJjyHQy1tZeDDcuheCYzSWn0xSFBX3Mpv1xmdxlLxRiKFSQJUdjhJXBPensDEAzOkdakxJToiuDr0klXaIVwr3IBAmREtDtLpSRIhVBDGQuM2P63fal53g/aZzK5ezbHuFZ798G/dD58eFVv54U9KD6qapFR22qDWqri9ZmZz20aoOm1WbW2qy1tsBidWeHxX+7Aj/bG3vUawWv9mnzvjmjutrlXWeS2vVVFzOru9Yl1W4OJjF7dds+aVeRS9qdE3VRU7qLLgbXnmK19Ri7tqZYGf81+l9AvwUYAFsRXgO8yBShAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAMAAAAvgQplAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA21pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTBBOTEyQTk2OTFDMTFFREJCQTQ4MEQxMEI3NzhFRUUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTBBOTEyQTg2OTFDMTFFREJCQTQ4MEQxMEI3NzhFRUUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjEyNGM5YzNiLTkzYzUtMTQ0OC1iNDhkLWQ5MjliMmE1NTI2NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2OEMyMEU3NjYwMzkxMUVEQkUwRjg5QzQ0NzlGMTcwNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrymvYUAAAAwUExURTAgLEk8RbKqqmFVXYp9gv///x0dHSwsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzk5OXQCvBgAAAAGdFJOU///////ALO/pL8AAADJSURBVHja1JIJFsMgCERHxyyatL3/bQuoaNJcoCjy/AZEAuJVEmK6CBWQpmoaSIvMyCX+HUjySJmm/H1tWdcyZC3IH5JBhq3YARIBIQTYyAJso0oIwsG2NRWWFTQoy3t2US04wwzkljyfq8s+n2tQi9FFY7w0H9QrZNmuMfSsiMJVXID5FmRsJ064lOOpHaQS1ghmDGhVUzMVeD85qP4daPnNX7/pv0EqxNF0Zm+g+ow8Oux5dODXsomDW6aWaGrmoR08QJOvAAMAz54JCo4zaZIAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAMAAAAvgQplAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1Rjk4MTlBNTY5MTkxMUVEODk0QUY2MTk2RkMzRkQ5QSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1Rjk4MTlBNjY5MTkxMUVEODk0QUY2MTk2RkMzRkQ5QSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVGOTgxOUEzNjkxOTExRUQ4OTRBRjYxOTZGQzNGRDlBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVGOTgxOUE0NjkxOTExRUQ4OTRBRjYxOTZGQzNGRDlBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+kl/wtwAAABhQTFRFZSwoXSQkpmFFjkEwdTAsw4JVNBAcTRwgnCGS7gAAAKxJREFUeNrsklsSQyEIQ+Hy2v+OS0At3ukSmh/GY8TISO7swZHKGu7k+tjTQnUKffRIjAscg1gdOR4TC+ICZRHrI5bARLGEI9qBhb7B5TBrz24qKdtNax8CqBxSUpGdw44AvDeXCUfw6H5+Vv8JUhxEADWgnhjzF8QC4ROkaM0UOOaQUaiaDtBN68IJrhwdbOSYoK7NpneO7HHnqFtmjlew9R1Wjv//GN/hI8AAMpwNYRsTIbAAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAMAAAAvgQplAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNDM5YTY3ZS1jZmQwLTBkNDAtYjcxZC02MDFjODZkYWYzZjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjkwMjFBNjc2Q0Q3MTFFRDhFRTVGNjNCMTNBODJEMzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjkwMjFBNjY2Q0Q3MTFFRDhFRTVGNjNCMTNBODJEMzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJlOTlkZGI4LWUxN2UtNjc0NC04YmIzLTQ1YWNhNjBmMTY2YiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozNDM5YTY3ZS1jZmQwLTBkNDAtYjcxZC02MDFjODZkYWYzZjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4OtNUFAAAACVBMVEW77fCr3uajzNZQMo+CAAAAPklEQVR42mJgZGRCAoyMDExMDIwILpAHY8BIBpgcTCsDFjMYcZnBQJEZDKS4gwGfO0jwy2h4jIYHTB1AgAEATlgFNRLiuuEAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAMAAAAvgQplAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0VGMEM5QUU4MTRCMTFFREIxQzRBNTlENjVEQzFCRTYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0VGMEM5QUQ4MTRCMTFFREIxQzRBNTlENjVEQzFCRTYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmNjYmFmOTc0LWI2YWItZjg0OC04ZWZkLTQ1YmI1ZDM3Yjk2MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5nyFTOAAABgFBMVEVNWTSSEgJWYUV5entiaVeUkpU8RS1xcXGXKxGlFQR0dHSFCwHkIhKtFQR0hlDaHgc2PShUV01UZj2CEQTXIgt8EQR6RCdiY19yCwN7DQNubW6EgYRtDAKBfoKkGASVCgBabTuNEQBcW1lidUOzGQtWAgF+fH5rfUyqGQRta21wc2uZFQZTUlN+Qzi4HAxwbnCIEQJqamqDRj1TXFGlEwmyFQVjBQFSXjyPEQWXFQFNTU2bFgeaFwKeFgWeFQKqFQlBQD9wBwBqa2KsHQliFQ1UaDhATSymEAJycHVrBgFOU0N0dnKRGAKJhoqNGQlxdHGMEgrfJhC/GQhua3CSj5Jna2ZfcEJGTzWYEwRYDwuZEAWWFAh+DQh3dnacDwKXlJdoCQBYXFNXWVehEgVOAABecD2RkJCpHRJ7fndnZ2ezGxB4eHh9f35UYzqNFAdvcHR3BwB9IA5+gIBsa21sbGxuaWxub2uKbldcZE9nfER3e3OuJQ2XGQe6FQXHJRNtCgADdoGmAAACvElEQVR42iyQC1PaQBSFb4oQSYg8ApIFEtny1IAEKwhCEERF8VXQAoIRBLSlCsWqrW1t89e7o97ZmZ37zd6z51ywu080zQtzfTp8aDQaT6HpfmTEG2+jP0ouJrSwBjB20wSM1x1j/yatPQE47hlG9HZtjsYm0xw3AK78D4QYi8njhKkRmYP3nm3/NsNcF3c99O1aYA5iDJ0Y3TPh4ihpCkTIi9j6a8XGPxgargIQS4je61PjYfHKT2s34RmAtV+Nk32xa/JH/EsGLUy+/RbRHhijzeGPLDVniI+l+/3Eiw/HDL1PRi7dD17DSOzafu+4GZv9O/Q9DK15RZN998unkcEEYH9kPKaq2OhrNG1rOgIAbk/C/uSO9J+q9uo7xxj67kXRsBju2o6JhumDgWRhGM3r3bncvU2ODM1tqN4zJyyIgb7Bc2zbyXIA2WTiD2va67tsRSWW46BmGQosP3SFSnovE7RYIMgOh+n0yykN02wJnCg0VNIhvafrvRBLDcCJeSXdIy0pgcq1wal0yqzvpWcxbnHgfJb/sXzpSPG5MKbyBKjtFl/qseWSwFM5qU6ARGGko48lpGAl8xdq+UKLEIyQQrXwxAy1tkrJLYwxomRpVa1AbVnKXljYVnbakaJliVhXCoWatWLmKlw0GpVS8HOeVHwlHo+Te2VlHs44rv6X4waDSqpi5bgKnJmj9Q11wsqyat4oy1nYMpejksy7fAhT6lGHgFRUymVcCPFI6QirA7irR2Uk+AQkCOi8HQzCLHeU4YXX9HtfJ1mYNZ8rb0DnMX6G2Quqdf4GplimCMhLOV7wTXXflCTKEw1zcJVkfXbpCqZklgCyD5dPR591RHUOnHDHlXNkH4jvlcjEVIati1wrlyH6yoRSByoLZ9ZUXhksU5ifqoVyQYWtzEF2w7qcVxcWJEnKL/wXYAD7zZrdqiCQKgAAAABJRU5ErkJggg==",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAMAAAAvgQplAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODY3RTRCNzY4MTUwMTFFRDlEQkNFRDhCQkNENDlBNkUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODY3RTRCNzU4MTUwMTFFRDlEQkNFRDhCQkNENDlBNkUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmE2MjNhNDkzLTgxYTMtZTY0NS1hNjkzLWIxMGJlN2ZkYTZiNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7ewuHUAAABgFBMVEXFWQCnKwBaAwP1tjrLewnuni7trSqzOwBxMjKrMgBmAgF2AQHlkh6JGACeKgCzVAC6PADekCSrSwDHSAfbiReWFhd3LCxHFBXkliWlMwDWhhXgjhrpliHtnCXysC5SGxvsmSKsOgDtmiRkKCiUJADejBm7RA1RFBO9MTFYISGzNACyTgCDQUHRgxGkNA3yszeXHgBeHR/qmCJsMjH2u0S+VQC9UgDztDitIyHUhBO8WACaJADsrzPpmyW6UQCpPA20XA2/YQ3ztDbgkB1kJyfnlB/omSrOgBPvri3ZiRi4VQDwsDHcihhtJCOpHyD0tDV2MC2NIACdKg3ikBvXix2vUABnJydnKilYDw5bDw+7TwBZHyF/AAHfjhyoIR9aIB/JeAdpJidoKSfRgBDCQACwUw2sQxpgHRysHx/llShwMDGzOw3nnDPHYg25Pw3Ofg7SfxGwQA2/RADYiBZ4LzCXKQCuLwBWGRm6LzCeMg3QWwDkkBy6YA3SgxXThhzqqiiIMcYWAAACuklEQVR42hyPCVvaQBCGJxs0mzugKQ1HQhIwHIrKWaQeFUFELSiCoiherUer1qrQVlv/ehd3n5nZne/Zd76F7253ZmRkNVOpXGXcO/8y4C64XOujeSuyMe7K07QF7rvjakgI0anm6nSgFNDh42jVEprjLp3WrchawQUj5RBtCXfTViBFv/97Nw2V8R+EsW6VIw8lXa9bUPEfT6fKZX2+6XsNBgQd8vVlokamXqvroabvmDAOBTpYKuWtVJAOHR5X4apwt6bX6eCz4C8s13XCeHBVrbJAp/y+aqocpCFD5j8/FHxDl8LDm4+yHvITRiigz+/s5ImPjSmiBp8PD306qTDSjOStoKVHzghD8OmEQQdD/g1XlaZLPt+ZC9TPZHePoqo6PEUvoaseRYcR/aD+il6qPHB8V+2qapfn+Wi3yyPgOX64uhynkkAIOmhYSHQ4nqQ9cJw91JlF6MJB5N6LgXNgc066d3IQQ52Lnp0G3OugwW4ad9BjG3GPbbCNk4ZtDDo818An3OY1oBM8iW0v2nx3irFDpsxiG+O2FzUmMR54vQPyBDVOB47XSLdJihng2A2EsO0YhoPta9uBA7zbeJzEpBFbITQHDMKaPDV6hpfouG2DYRDoYCV94DVWMLZt+JpM3kzcb78sTtwuJZPbL/CtKM5kE8BIVF8EqJnwWxT3FeVc1ijqD6OZHvji8TDxOCV65Nx5X9oSYYJVaoo2IzMsM2cWZ7KwGJ4Rc/stTZIkdsHTMmGREoHR2ISpSB5T03JwU8sy8ad40ZMAjaXEIUOrjbFMjWF+gsKKHkiGRSkHYEpSvw+1hAb3RTFHGC2tTyVY1mzBkpxg+pK01ZJlJR5+8xHPKdKTzDBKwgw/ZeFWkqhsbc6U+mx4YW7OhDFWAoU5zz0VqYSihPfhkywzSrxP/gIMRRj/BRgAnLOBpcDN0XwAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAMAAAAvgQplAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTc5N0IzNzNDRDgwMTFFREI0QjhDNTc1ODhEQ0U5QUEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTc5N0IzNzJDRDgwMTFFREI0QjhDNTc1ODhEQ0U5QUEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmE2MjNhNDkzLTgxYTMtZTY0NS1hNjkzLWIxMGJlN2ZkYTZiNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MjU4MTcxNi1mMzRjLWFlNDctYjBlOS00NzY4MDA2OThhMmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4AefvtAAAAOVBMVEWy1dV4VU2Hh4d+iWm4hXCVbF10WERsbGxsbH7X7+/w/f33/v5ZPSm5hVzu///2//+WbEr///95VTp2t8fQAAAA0klEQVR42sxP25bCMAikpq6Skgv8/8c6Q/ries66b0paLhNmINLdfQyn7zRx+gXQd+nMkI9scXawSluUFw10UWJ1pUaKjqUzup/AX1P67yn+PMX/MeXdW/x1SqUdpBz0VSoz5KiOWglUVmnZLKrAF3BoVRVRQURvVqg3KapMVexaZJfdtqJl2+9lv244EtHanBHT0k+hx7FgjSC4QsQf7I0JgLFNaw2kSyRl4uYGiuETeiJxkkiJHypaMzA5xRrEjYLnWK5xibUFNb51sc/s8RBgAPteK87jQ56VAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAMAAAAvgQplAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjQ5NTY2QjBDRDgzMTFFRDlBMDVEQjdCQUJGNTMyQTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjQ5NTY2QUZDRDgzMTFFRDlBMDVEQjdCQUJGNTMyQTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkE4QTFCNzYzNUZBQTExRURBQTFEOEE4NUYzQkVDMDdDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkE4QTFCNzY0NUZBQTExRURBQTFEOEE4NUYzQkVDMDdDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bcmsswAAAEtQTFRFrmJPd0czdDUgVjUia1VTjn13moeBY0QqhkkooFxKj0YwlH94jHJqg2VenV5NkXZubEQ4g0g3dEEthVE+mFVEfWBZajsphmtklEw4g+r2KQAAALdJREFUeNrskEu2wzAIQ3HS5tV/Azaw/5XWpB2/FZQBGkm6RwCRNQLEFrm3OBtYYhU0s4QqlgyGjPwniFvLCBJAa8+6Vq3F9aEQIU6eXNqcxpMUaNvtRSqUMKWjwGAWkvEcQohyduju7z0X3VpLBpi737/nwOaYuz94TiJFSxOC92+OOycQg979fl8Obs39tUVX7B8OQ8VbN8eGcI5+HkR0nBnKY9W19Ho6UL4u+O3x2+OfPd4CDABmSjAHS4WZHQAAAABJRU5ErkJggg==",
];

const COL_ORANGE = '#FFA500';
const COL_AQUA = '#00FFFF';
const COL_PINK = '#FF00FF';
const COL_DELETE = '#FF0000';
const COL_HIDE = '#FFFF00';
const COL_STARTUP = '#6480B6';
const COL_AXIS_X = '#EA3751';
const COL_AXIS_Y = '#85D10C';
const COL_AXIS_Z = '#2F81DF';

const PI2 = Math.PI * 2;
const PIH = Math.PI / 2;
const MAXAMOUNT = 64000;
const FPS = 1000 / 60;
const FPS_TOOLMOVE = 1000 / 30;
const GRAVITY = (-9.81 / 60) * 4;
const viewAxes = [];

let isRendering = true;
let isGravity = false;
let MODE = 0; // model|bake|sandbox
let currentColor = document.getElementById('input-color').value.toUpperCase();
let currentColorBake = document.getElementById('input-material-albedo').value.toUpperCase();
let isRenderAxisView = true;
let azimuth = null;

const canvas = document.getElementById('canvas_render');
const canvasPalette = document.getElementById('canvas_palette');


// -------------------------------------------------------
// Initialize


const engine = new BABYLON.Engine(canvas, true, {});
engine.disablePerformanceMonitorInBackground = true;
engine.preserveDrawingBuffer = false;
engine.premultipliedAlpha = false;
engine.enableOfflineSupport = false;
engine.doNotHandleContextLost = true;
engine.loadingScreen = new CustomLoadingScreen();
engine.displayLoadingUI();


let light = undefined;
const camera = new Camera();
const scene = createScene(engine);
camera.init(scene);
const sceneAxisView = createAxisViewScene(engine, scene);

const ui = new UserInterface(scene);
const uix = new UserInterfaceAdvanced(scene);
const preferences = new Preferences();

const hdri = new HDRI(scene);
const pipeline = new Pipeline(scene);
const material = new Material(scene);

const builder = new Builder(scene);
const bakery = new Bakery(scene);

const palette = new Palette();
const helper = new Helper(scene, sceneAxisView);
const symmetry = new Symmetry();

const tool = new Tool(scene);
const toolBakery = new ToolBakery(scene);

const project = new Project(scene);
const snapshot = new Snapshot(scene);
const memory = new Memory();

const generator = new Generator();
const voxelizer = new Voxelizer(scene);

const client = new WebsocketClient();


// intro
scene.executeOnceBeforeRender(() => {
    preferences.init();
}, 0);

scene.executeWhenReady(() => {
    (preferences.getNoIntro()) ?
        project.newBox(8, currentColor) :
        project.loadFromUrl('samples/startup.vbx');
    engine.hideLoadingUI();
    preferences.finish();
}, 100);


// render loops
engine.runRenderLoop(() => {
    if (isRendering)
        scene.render();
});

scene.registerAfterRender(() => {
    if (isRendering) {
        if (isRenderAxisView) {
            sceneAxisView.render();
            if (MODE !== 2) {
                sceneAxisView.activeCamera.alpha = scene.activeCamera.alpha;
                sceneAxisView.activeCamera.beta = scene.activeCamera.beta;
            } else {
                azimuth = BABYLON.Spherical.FromVector3(camera.camera2.position);
                sceneAxisView.activeCamera.alpha = azimuth.phi;
                sceneAxisView.activeCamera.beta = azimuth.theta;
            }
        }
        
        if (scene.activeCamera.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA)
            camera.setOrthoZoom();

        ui.updateStatus();
    }
});


// -------------------------------------------------------
// Scene


function createScene(engine) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    scene.autoClear = false;
    scene.autoClearDepthAndStencil = false;
    scene.blockMaterialDirtyMechanism = true;
    scene.gravity = new BABYLON.Vector3(0, GRAVITY, 0);
    scene.collisionsEnabled = false; // overrided on setMode()
    scene.useRightHandedSystem = true;
    //scene.imageProcessingConfiguration.toneMappingEnabled = true;
    //scene.imageProcessingConfiguration.toneMappingEnabled = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;

    const ambient = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), scene);
    ambient.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
    ambient.specular = new BABYLON.Color3(0.2, 0.2, 0.2);
    ambient.groundColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ambient.intensity = 0.5;

    light = new Light(scene);
    
    const shadowcatcher = BABYLON.MeshBuilder.CreateGround("shadowcatcher", { width: 1000, height: 1000 }, scene);
    shadowcatcher.material = new BABYLON.ShadowOnlyMaterial('shadowcatcher', scene);
    shadowcatcher.material.shadowColor = BABYLON.Color3.FromHexString('#161a20');
    shadowcatcher.material.activeLight = light.directional;
    shadowcatcher.material.backFaceCulling = true;
    shadowcatcher.material.alpha = 0.3;
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

    const ambient = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, -1, 0), scene);
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

    const axisHelper = new BABYLON.AxesViewer(scene, 0.6, 0, null,null,null, 4);
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
    viewAxes[0].overlayColor = BABYLON.Color3.FromHexString(COL_AXIS_X);
    viewAxes[1].position.x = -0.85;
    viewAxes[1].scaling.scaleInPlace(-0.9); // exclude border size
    viewAxes[1].overlayAlpha = 0.3;
    viewAxes[1].visibility = 0.01;
    viewAxes[1].overlayColor = viewAxes[0].overlayColor;
    viewAxes[1].outlineColor = viewAxes[0].overlayColor;
    viewAxes[2].position.y = 0.85;
    viewAxes[2].renderOutline = false;
    viewAxes[2].overlayColor = BABYLON.Color3.FromHexString(COL_AXIS_Y);
    viewAxes[3].position.y = -0.85;
    viewAxes[3].scaling.scaleInPlace(-0.9);
    viewAxes[3].overlayAlpha = 0.3;
    viewAxes[3].visibility = 0.01;
    viewAxes[3].overlayColor = viewAxes[2].overlayColor;
    viewAxes[3].outlineColor = viewAxes[2].overlayColor;
    viewAxes[4].position.z = 0.85;
    viewAxes[4].renderOutline = false;
    viewAxes[4].overlayColor = BABYLON.Color3.FromHexString(COL_AXIS_Z);
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
                    if (MODE == 1) { // solved picking conflict for camera.frame() (deselected bake)
                        bakery.selected = bakery.lastSelected;
                        bakery.lastSelected = null;
                    }
                    camera.frame();
                } else {
                    if (MODE !== 2) {
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
        }
    });

    return scene;
}


// -------------------------------------------------------
// Camera


function Camera() {
    const CAM2SPEED = 0.9;
    this.camera0 = null;    // model (startup)
    this.camera1 = null;    // bakery
    this.camera2 = null;    // render
    this.cameraView = '';
    let speedTimeout = null;
    
    this.init = function(scene) {
        this.camera0 = new BABYLON.ArcRotateCamera("camera_model", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
        this.camera1 = new BABYLON.ArcRotateCamera("camera_bakery", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
        this.camera2 = new BABYLON.UniversalCamera("camera_sandbox", new BABYLON.Vector3(38, 42, 38), scene);

        const fov = parseFloat(document.getElementById('input-camera-fov').value); //def: 0.8

        this.camera0.setPosition(new BABYLON.Vector3(10, 10, 10));
        this.camera0.setTarget(BABYLON.Vector3.Zero());
        this.camera0.lowerRadiusLimit = 2;
        this.camera0.upperRadiusLimit = 1000;
        this.camera0.wheelPrecision = 3; //def: 3
        this.camera0.pinchPrecision = 30; //def: 12
        this.camera0.panningSensibility = 300; //def: 1000
        //this.camera0.inertia = 0.85; //def: 0.9
        this.camera0.minZ = 1;
        this.camera0.maxZ = 1000;
        this.camera0.fov = fov; //def: 0.8

        this.camera1.setPosition(new BABYLON.Vector3(38, 42, 38));
        this.camera1.setTarget(new BABYLON.Vector3(0, 5, 0));
        this.camera1.lowerRadiusLimit = 2;
        this.camera1.upperRadiusLimit = 1000;
        this.camera1.wheelPrecision = 3;
        this.camera1.pinchPrecision = 30;
        this.camera1.panningSensibility = 300;
        this.camera1.minZ = 1;
        this.camera1.maxZ = 1000;
        this.camera1.fov = fov;

        this.camera2.setTarget(new BABYLON.Vector3(0, 5, 0));
        this.camera2.checkCollisions = false; // initial
        this.camera2.applyGravity = false; // initial
        this.camera2.speed = CAM2SPEED; // overrided
        this.camera2.minZ = 1;
        this.camera2.maxZ = 1000;
        this.camera2.fov = fov;
        this.camera2.angularSensibility = 5000;
        this.camera2.ellipsoid = new BABYLON.Vector3(1, 4.5, 1);
        this.camera2._needMoveForGravity = false; // initial
        this.camera2.keysUp = ['W'.charCodeAt(0)];
        this.camera2.keysLeft = ['A'.charCodeAt(0)];
        this.camera2.keysDown = ['S'.charCodeAt(0)];
        this.camera2.keysRight = ['D'.charCodeAt(0)];
        this.camera2.keysUpward = ['E'.charCodeAt(0)];
        this.camera2.keysDownward = ['Q'.charCodeAt(0)];
        this.camera2.onCollide = (mesh) => {
            if (mesh !== helper.groundPlane) {
                //
            }
        }
    }

    this.switchCamera = function() {
        scene.activeCamera.detachControl(canvas);
        if (MODE == 0) {
            scene.activeCamera = this.camera0;
            this.camera0.attachControl(canvas, true);
        } else if (MODE == 1) {
            scene.activeCamera = this.camera1;
            this.camera1.attachControl(canvas, true);
        } else if (MODE == 2) {
            scene.activeCamera = this.camera2;
            this.camera2.attachControl(canvas, true);
        }
        ui.domCameraFov.value = scene.activeCamera.fov;
    }

    this.frame = function(scale = 35) {
        if (MODE == 0) {
            this.setFramingBehavior(this.camera0, builder.SPS.mesh, scale);
        } else if (MODE == 1) {
            if (bakery.selected) { // zoom to selected mesh
                this.setFramingBehavior(this.camera1, bakery.selected, scale);
            } else {
                animator(this.camera1, 'position', this.camera1.position.clone(), this.camera0.position);
                animator(this.camera1, 'target', this.camera1.target.clone(), this.camera0.target);
            }
        } else if (MODE == 2) {
            if (ui.currentRenderMode == 'bake') {
                animator(this.camera2, 'position', this.camera2.position.clone(), this.camera1.position);
                animator(this.camera2, 'target', this.camera2.target.clone(), this.camera1.target);
            } else { // frame to camera0 if there is no bake
                animator(this.camera2, 'position', this.camera2.position.clone(), this.camera0.position);
                animator(this.camera2, 'target', this.camera2.target.clone(), this.camera0.target);
            }
        }
    }

    this.setFramingBehavior = function(cam, target, scale) {
        target.computeWorldMatrix(true);
        const bounds = target.getBoundingInfo();
        const bbox = bounds.boundingBox;
        const radiusWorld = bbox.maximumWorld.subtract(bbox.minimumWorld).scale(0.5);
        const centerWorld = bbox.minimumWorld.add(radiusWorld);
        const zoomTargetY = bbox.minimumWorld.y + (bbox.maximumWorld.y - bbox.minimumWorld.y) * 0.5;
        const zoomTarget = new BABYLON.Vector3(centerWorld.x, zoomTargetY, centerWorld.z);
        const radius = bounds.boundingSphere.radiusWorld;
        //cam.lowerRadiusLimit = radiusWorld.length() + cam.minZ;
        //cam.upperRadiusLimit = radiusWorld.length() + cam.maxZ;
        animator(cam, 'radius', cam.radius, (radius + scale) / cam.fov);
        animator(cam, 'target', cam.target.clone(), zoomTarget);
    }

    this.toggleCameraAutoRotation = function() {
        scene.activeCamera.useAutoRotationBehavior = !scene.activeCamera.useAutoRotationBehavior;
        if (scene.activeCamera.useAutoRotationBehavior) {
            scene.activeCamera.autoRotationBehavior.idleRotationSpeed = 0.1; //-0.1 CCW
            scene.activeCamera.autoRotationBehavior.idleRotationWaitTime = 1;
            scene.activeCamera.autoRotationBehavior.idleRotationSpinupTime = 1;
        }
        ui.domAutoRotation.checked = scene.activeCamera.useAutoRotationBehavior;
    }

    this.switchOrtho = function() {
        if (scene.activeCamera.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
            this.setView('persp');
        } else {
            this.setView('ortho');
        }
    }

    this.setView = function(name) {
        this.cameraView = name;
        builder.SPS.mesh.computeWorldMatrix(true);
        const bbox = builder.SPS.mesh.getBoundingInfo().boundingBox;
        const zoomTargetY = bbox.minimumWorld.y + (bbox.maximumWorld.y - bbox.minimumWorld.y) * 0.5;
        const zoomTarget = new BABYLON.Vector3(0, zoomTargetY, 0);
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
            scene.activeCamera.position = position.multiplyByFloats(
                scene.activeCamera.radius, scene.activeCamera.radius, scene.activeCamera.radius).add(zoomTarget);
            scene.activeCamera.target = zoomTarget;
        }
    }

    this.setOrthoZoom = function() {
        const radius = scene.activeCamera.radius / 2;
        const sizeY = radius * scene.activeCamera.fov;
        const sizeX = radius * scene.activeCamera.fov * scene.getEngine().getAspectRatio(scene.activeCamera);
        scene.activeCamera.orthoLeft = -sizeX;
        scene.activeCamera.orthoRight = sizeX;
        scene.activeCamera.orthoTop = sizeY;
        scene.activeCamera.orthoBottom = -sizeY;
    }

    this.setFov = function(value) {
        const fov = parseFloat(value);
        scene.activeCamera.fov = fov;
        if (MODE == 2) {
            ui.domReticle.children[2].style.width  = fov * 100 + 'px';
            ui.domReticle.children[2].style.height = fov * 100 + 'px';
            ui.domReticle.children[2].style.marginLeft = 49-(fov * 100)/2 + 'px';
            ui.domReticle.children[2].style.marginTop  = 49-(fov * 100)/2 + 'px';
        }
    }

    this.speedUp = function() {
        if (this.camera2.speed == CAM2SPEED)
            clearTimeout(speedTimeout);

        this.camera2.speed = CAM2SPEED * 3;
        speedTimeout = setTimeout(() => {
            this.camera2.speed = CAM2SPEED;
        }, 5000);
    }

    this.jump = function() {
        if (isGravity)
            animator(this.camera2, 'position.y', this.camera2.position.y, 20, 20,10);
    }

    this.switchGravity = function(elem) {
        isGravity = !isGravity;
        this.camera2.checkCollisions = isGravity;
        this.camera2.applyGravity = isGravity;
        this.camera2._needMoveForGravity = isGravity;
        helper.groundPlane.checkCollisions = isGravity;
        if (MODE == 2) {
            if (isGravity) {                
                animator(this.camera2, 'target', this.camera2.target.clone(), BABYLON.Vector3.Zero(), 15,10);
                if (this.camera2.position.y < 0) // prevent falling
                    animator(this.camera2, 'position.y', this.camera2.position.y, 1);

                ui.domSandboxControls.children[1].style.display = 'unset';
                ui.domSandboxControls.children[2].style.display = 'unset';
                elem.style.color = '#83CD5B90';
            } else {
                animator(this.camera2, 'position.y', this.camera2.position.y, 5);

                ui.domSandboxControls.children[1].style.display = 'none';
                ui.domSandboxControls.children[2].style.display = 'none';
                elem.style.color = '#cccccc50';
            }
        }
    }
}


// -------------------------------------------------------
// Light


function Light(scene) {
    this.SUN_POS = new BABYLON.Vector3(10, 100, 10);
    this.SUN_ANG = 45; // more voxels are visible with default lighting at 45 deg
    this.directional = null;

    this.init = function() {
        this.directional = new BABYLON.DirectionalLight("directional", new BABYLON.Vector3(0, -1, 0), scene);
        this.directional.position.y = this.SUN_POS.y; // overrided
        setLightPositionByAngle(this.SUN_ANG);
        this.directional.autoUpdateExtends = true; // to REFRESHRATE_RENDER_ONCE
        this.directional.diffuse = BABYLON.Color3.FromHexString(document.getElementById('input-light-color').value);
        this.directional.intensity = document.getElementById('input-light-intensity').value;
        this.directional.shadowMaxZ = 2500;
        this.directional.shadowMinZ = -2500;
    
        // shadows updated manually on mesh changes to save performance
        const shadowGen = new BABYLON.ShadowGenerator(512, this.directional);
        shadowGen.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        shadowGen.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM;
        shadowGen.useExponentialShadowMap = true; // def: true
        shadowGen.usePercentageCloserFiltering = true; // webgl2 only, fallback -> usePoissonSampling
        shadowGen.forceBackFacesOnly = false;
        shadowGen.bias = 0.00005; // def: 0.00005
        shadowGen.setDarkness(0); // overrided in setMode() and setRenderMode()
    }

    this.updateShadowMap = function() {
        this.directional.getShadowGenerator().getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
    }
    
    this.updateAngle = function(angle) {
        setLightPositionByAngle(angle);
        this.updateShadowMap();
    }
    
    this.updateHeight = function(posY) {
        this.directional.position.y = posY;
        this.directional.setDirectionToTarget(BABYLON.Vector3.Zero());
        this.updateShadowMap();
    }
    
    this.updateIntensity = function(value) {
        this.directional.intensity = value;
    }
    
    this.updateColor = function(hex) {
        this.directional.diffuse = BABYLON.Color3.FromHexString(hex);
    }

    this.updateDarkness = function(val) {
        this.directional.getShadowGenerator().setDarkness(val);
    }
    
    this.getDirection = function() {
        return this.directional.direction;
    }
    
    this.enableShadows = function(isEnabled) {
        scene.getNodeByName("shadowcatcher").isVisible = isEnabled;
        this.directional.shadowEnabled = isEnabled;
        if (MODE == 0) builder.createSPS();
    }

    this.addMesh = function(mesh) {
        this.directional.getShadowGenerator().addShadowCaster(mesh);
    }

    function setLightPositionByAngle(angle, dist = 50) { // SUN_POS.y/2
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
            window.pt.loadHDR(url);

        if (this.hdrMap) {
            this.hdrMap.dispose();
            this.hdrMap = null;
        }
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
// Pipeline (post-process)


function Pipeline(scene) {
    this.pip = null;
    this.ssao = null;
    this.isHq = false;
    this.curve = null;

    this.init = function() {
        if (this.pip) this.dispose(); // prevent overdraw

        this.pip = new BABYLON.DefaultRenderingPipeline("default", true, scene, [ camera.camera2 ]);

        this.pip.imageProcessingEnabled = true;
        this.pip.imageProcessing.toneMappingEnabled = true;
        this.pip.imageProcessing.applyByPostProcess = true;
        this.pip.imageProcessing.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
        this.pip.imageProcessing.contrast = parseFloat(ui.domPipelineContrast.value);
        this.pip.imageProcessing.exposure = parseFloat(ui.domPipelineExposure.value);
        this.pip.imageProcessing.vignetteEnabled = true;
        this.pip.imageProcessing.vignetteWeight = parseInt(ui.domPipelineVignette.value);
        this.pip.imageProcessing.vignetteStretch = 2;
        this.pip.imageProcessing.vignetteColor = new BABYLON.Color4(0, 0, 0, 0);
        this.pip.imageProcessing.colorCurvesEnabled = true;
        if (this.pip.imageProcessing.colorCurvesEnabled) {
            this.curve = new BABYLON.ColorCurves();
            this.curve.globalDensity = 0; //def: 0
            this.curve.globalExposure = 0; //def: 0
            this.curve.globalHue = parseInt(ui.domPipelineHue.value); //def: 30
            this.curve.globalSaturation = 0; //def: 0
            this.curve.highlightsDensity = 0; //def: 0
            this.curve.highlightsExposure = 0; //def: 0
            this.curve.highlightsHue = parseInt(ui.domPipelineHue.value); //def: 30
            this.curve.highlightsSaturation = 0; //def: 0
            this.curve.midtonesDensity = 0; //def: 0
            this.curve.midtonesExposure = 0; //def: 0
            this.curve.midtonesHue = parseInt(ui.domPipelineHue.value); //def: 30
            this.curve.midtonesSaturation = 0; //def: 0
            this.curve.shadowsDensity = 0; //def: 0
            this.curve.shadowsExposure = 0; //def: 0
            this.curve.shadowsHue = parseInt(ui.domPipelineHue.value); //def: 30
            this.curve.shadowsDensity = 80; //def: 80
            this.curve.shadowsSaturation = 0; //def: 0
            this.pip.imageProcessing.colorCurves = this.curve;
        }

        this.pip.samples = 1; //MSAA def: 1
        this.pip.fxaaEnabled = true;
        if (this.pip.fxaaEnabled)
            this.pip.fxaa.samples = 1; //def: 1

        this.pip.sharpenEnabled = true;
        this.pip.sharpen.edgeAmount = parseFloat(ui.domPipelineSharpen.value);
        this.pip.sharpen.colorAmount = 1;

        this.pip.grainEnabled = true;
        this.pip.grain.intensity = parseInt(ui.domPipelineGrain.value);
        this.pip.grain.animated = false;

        this.pip.bloomEnabled = ui.domPipelineBloom.checked;
        if (this.pip.bloomEnabled) {
            this.pip.bloomThreshold = 0.4;
            this.pip.bloomWeight = 0.3;
            this.pip.bloomKernel = 64;
            this.pip.bloomScale = 0.5;
        }

        this.pip.depthOfFieldEnabled = ui.domPipelineDof.checked;
        if (this.pip.depthOfFieldEnabled) {
            this.pip.depthOfField.focusDistance = parseInt(ui.domPipelineDofDist.value) * builder.SPS.mesh.getDistanceToCamera(camera.camera2);
            this.pip.depthOfField.focalLength = 180;
            this.pip.depthOfField.fStop = 2.0;
            this.pip.depthOfField.lensSize = 50; // default
            this.pip.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
            if (isMobileDevice())
                this.pip.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Low;
        }

        this.pip.chromaticAberrationEnabled = true;
        if (this.pip.chromaticAberrationEnabled) {
            this.pip.chromaticAberration.aberrationAmount = parseInt(ui.domPipelineChromatic.value); //def: 30
            this.pip.chromaticAberration.alphaMode = 0; //def: 0
            this.pip.chromaticAberration.alwaysForcePOT = false; //def: false
            this.pip.chromaticAberration.enablePixelPerfectMode = false; //def: false
            this.pip.chromaticAberration.forceFullscreenViewport = true;
        }
        
        if (!isMobileDevice()) {
            this.ssao = new BABYLON.SSAORenderingPipeline("ssao", scene,
                { ssaoRatio: 0.5, combineRatio: 1.0 }, [ camera.camera2 ]);
            this.ssao.fallOff = 0.00001;  //def: 0.000001
            this.ssao.radius = 0.0010;    //def: 0.0006
            this.ssao.area = 0.0100;      //def: 0.0075
            this.ssao.base = 0.6;         //lower=darker
            this.ssao.totalStrength = 1;
        }

        this.isHq = true;
        ui.domPipelineDofDist.disabled = !ui.domPipelineDof.checked;
    }

    this.updateProps = function() {
        if (MODE == 2 && this.pip) {
            this.pip.imageProcessing.contrast = parseFloat(ui.domPipelineContrast.value);
            this.pip.imageProcessing.exposure = parseFloat(ui.domPipelineExposure.value);
            this.pip.imageProcessing.vignetteWeight = parseInt(ui.domPipelineVignette.value);
            this.pip.bloomEnabled = ui.domPipelineBloom.checked;
            this.pip.depthOfFieldEnabled = ui.domPipelineDof.checked;
            this.pip.depthOfField.focusDistance = parseInt(ui.domPipelineDofDist.value) * builder.SPS.mesh.getDistanceToCamera(camera.camera2);
            this.pip.sharpen.edgeAmount = parseFloat(ui.domPipelineSharpen.value);
            this.pip.grain.intensity = parseInt(ui.domPipelineGrain.value);
            this.pip.chromaticAberration.aberrationAmount = parseInt(ui.domPipelineChromatic.value);
            this.curve.globalHue = parseInt(ui.domPipelineHue.value);
            this.curve.highlightsHue = parseInt(ui.domPipelineHue.value);
            this.curve.midtonesHue = parseInt(ui.domPipelineHue.value);
            this.curve.shadowsHue = parseInt(ui.domPipelineHue.value);
        }
    }

    this.toggle = function() {
        (this.isHq) ? this.dispose() : this.init();
    }

    this.dispose = function() {
        if (this.ssao) {
            this.ssao.dispose();
            this.ssao = null;
        }
        if (this.pip) { // important to prevent multiple camera conflict
            this.pip.fxaaEnabled = false;
            this.pip.imageProcessingEnabled = false;
            this.pip.sharpenEnabled = false;
            this.pip.grainEnabled = false;
            this.pip.bloomEnabled = false;
            this.pip.depthOfFieldEnabled = false;
            this.pip.chromaticAberrationEnabled = false;
            this.pip.dispose();
            this.pip = null;
        }
        this.isHq = false;
    }
}


// -------------------------------------------------------
// Material


function Material(scene) {
    this.texId = 0; // current PBR texture
    this.mat_cel = null;
    this.mat_pbr = null;
    this.mat_ghost = null;
    this.mat_workplane = null;
    this.mat_grid = null;
    this.mat_grid_sandbox = null;
    this.tex_cel = null;
    this.tex_pbr = null;
    this.textures = [];

    this.init = function() {
        for (let i = 0; i < TEX_PATTERNS.length; i++) // load pattern textures
            this.textures.push(this.createTexture('texpat'+i, TEX_PATTERNS[i], BABYLON.Texture.LINEAR_LINEAR_MIPLINEAR));

        for (let i = 0; i < TEX_PRESETS.length; i++)
            this.addTexture(TEX_PRESETS[i]); // import texture samples

        this.tex_cel = this.createVoxelTexture('#000000');
        this.setPBRTexture(); //def: 3=checker

        this.createCelMaterial();
        this.createWorkplaneMaterial();
        this.createGridMaterial();
        this.createSandboxGridMaterial();
        this.createGhostMaterial();
    }

    this.createCelMaterial = function() {
        if (this.mat_cel) {
            this.mat_cel.dispose();
            this.mat_cel = null;
        }
        const mat = new BABYLON.StandardMaterial("CEL", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        mat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        mat.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        mat.emissiveTexture = this.tex_cel;
        mat.opacityTexture = this.tex_cel;
        mat.opacityFresnelParameters = new BABYLON.FresnelParameters();
        mat.opacityFresnelParameters.leftColor = new BABYLON.Color3(0.85, 0.85, 0.85);
        mat.opacityFresnelParameters.rightColor = new BABYLON.Color3(0.85, 0.85, 0.85);
        mat.useEmissiveAsIllumination = false;
        mat.linkEmissiveWithDiffuse = true;
        mat.backFaceCulling = true;
        mat.transparencyMode = 0;
        this.mat_cel = mat;
    }

    this.createPBRMaterial = function(backFaceCulling = true) { // initial/overrided
        if (this.mat_pbr) {
            this.mat_pbr.albedoTexture.dispose();
            this.mat_pbr.reflectionTexture.dispose();
            this.mat_pbr.dispose();
            this.mat_pbr = null;
        }
        const mat = new BABYLON.PBRMaterial("PBR", scene);
        mat.albedoColor = new BABYLON.Color3(1, 1, 1);
        mat.albedoTexture = this.tex_pbr.clone();
        mat.reflectionTexture = hdri.hdrMap.clone();
        mat.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
        mat.roughness = 0.8;
        mat.metallic = 0.5;
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

    this.createExportMaterial = function() {
        const mat = new BABYLON.StandardMaterial("export", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        mat.specularColor = new BABYLON.Color3(1, 1, 1);
        mat.backFaceCulling = true;
        mat.freeze();
        return mat;
    }

    this.createWorkplaneMaterial = function() {
        const mat = new BABYLON.GridMaterial("workplane", scene);
        mat.gridRatio = 1;
        mat.majorUnitFrequency = 20;
        mat.minorUnitVisibility = 0.3;
        mat.mainColor = new BABYLON.Color3(0, 1, 1);
        mat.lineColor = new BABYLON.Color3(0, 1, 1);
        mat.opacity = 0.5;
        mat.backFaceCulling = false;
        mat.freeze();
        this.mat_workplane = mat;
    }

    this.createGridMaterial = function() {
        const mat = new BABYLON.GridMaterial("grid", scene);
        mat.opacityTexture = new BABYLON.Texture(PARTICLE, scene, undefined, undefined, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        mat.opacityTexture.optimizeUVAllocation = true;
        mat.gridRatio = 0; // overrided by setGrid()
        mat.majorUnitFrequency = 40;
        mat.minorUnitVisibility = 0.3;
        mat.mainColor = new BABYLON.Color3(1,1,1);
        mat.lineColor = new BABYLON.Color3(1,1,1);
        mat.opacity = 0.05;
        mat.backFaceCulling = false;
        mat.freeze();
        this.mat_grid = mat;
    }

    this.createSandboxGridMaterial = function() {
        const mat = new BABYLON.GridMaterial("grid_sandbox", scene);
        mat.gridRatio = 10;
        mat.majorUnitFrequency = 40;
        mat.minorUnitVisibility = 0.6;
        mat.mainColor = new BABYLON.Color3(1,1,1);
        mat.lineColor = new BABYLON.Color3(1,1,1);
        mat.opacity = 0.012;
        mat.backFaceCulling = false;
        mat.freeze();
        this.mat_grid_sandbox = mat;
    }

    this.createGhostMaterial = function() {
        const mat = new BABYLON.StandardMaterial("ghostvoxel", scene);
        mat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        mat.specularColor = new BABYLON.Color3(0, 0, 0);
        mat.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mat.emissiveTexture = this.tex_cel;
        mat.opacityTexture = this.tex_cel;
        mat.opacityFresnelParameters = new BABYLON.FresnelParameters();
        mat.opacityFresnelParameters.leftColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        mat.opacityFresnelParameters.rightColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        mat.useEmissiveAsIllumination = false;
        mat.linkEmissiveWithDiffuse = true;
        mat.backFaceCulling = true;
        mat.transparencyMode = 0;
        mat.checkReadyOnEveryCall = false;
        this.mat_ghost = mat;
    }

    this.createVoxelTexture = function(hex) {
        const tex = new BABYLON.DynamicTexture('voxelgrid', 256, scene, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        const ctx = tex.getContext();
        ctx.lineWidth = 4; // grid
        ctx.strokeStyle = hex + '30';
        ctx.beginPath();
        ctx.moveTo(0, 128);
        ctx.lineTo(256, 128);
        ctx.moveTo(128, 0);
        ctx.lineTo(128, 256);
        ctx.stroke();
        ctx.lineWidth = 8; // outline
        ctx.strokeStyle = hex + '60';
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

    this.deleteTexture = function(ev) {
        ev.preventDefault();
        const imgs = document.querySelectorAll('#menu-texture img');
        for (let i = 0; i < imgs.length; i++) {
            if (imgs[i].src == ev.dataTransfer.getData("text")) {
                ui.domTexturePresets.removeChild(imgs[i].parentElement);
                this.textures[ parseInt(imgs[i].dataset.bind) ].dispose();
                // TODO: this.textures.splice(i, 1);
            }
        }
        this.setPBRTexture();
    }

    this.init();
}


// -------------------------------------------------------
// Builder (SPS particles)
// voxel = {
//    position: vector3,
//    color: #HEXHEX (uppercase/no alpha)
//    visible: bool
// }


function Builder(scene) {
    this.voxels = [];
    this.voxel = null;
    this.SPS = null;

    this.init = function() {
        this.voxel = BABYLON.MeshBuilder.CreateBox("voxel", { sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
        this.voxel.isVisible = false;
        this.voxel.isPickable = false;
        this.voxel.doNotSerialize = true;
        this.voxel.convertToUnIndexedMesh();
        this.voxel.freezeWorldMatrix();
        this.voxel.freezeNormals();
    }

    this.createSPS = function(voxels = this.voxels) {
        if (this.SPS)
            this.SPS.dispose();
        this.SPS = new BABYLON.SolidParticleSystem('SPS', scene, { 
            isPickable: true, updatable: true, expandable: false,
            boundingSphereOnly: true // faster, no bbox computation
        });
        
        this.SPS.addShape(this.voxel, voxels.length, { positionFunction: (particle, i, s) => {
            particle.position.copyFrom(voxels[i].position);
            particle.color = BABYLON.Color4.FromHexString(voxels[i].color);
            if (!voxels[i].visible) // respect hidden voxels to enable hide and seek
                particle.scaling = BABYLON.Vector3.Zero(); // unable to use particle.isVisible
        }});

        this.SPS.buildMesh();
        this.SPS.mesh.material = material.mat_cel;
        this.SPS.mesh.receiveShadows = true;
        //this.SPS.mesh.freezeWorldMatrix();
        //this.SPS.mesh.freezeNormals();

        this.SPS.initParticles();
        //this.SPS.setParticles();       // update SPS mesh and draw it
        //this.SPS.refreshVisibleSize(); // update BBox for picking and shadows
        //this.SPS.computeBoundingBox = false;
        //this.SPS.computeParticleColor = false;
        //this.SPS.computeParticleRotation = false;
        //this.SPS.computeParticleTexture = false;
        //this.SPS.computeParticleVertex = false;

        light.addMesh(this.SPS.mesh);
        light.updateShadowMap();
        palette.create();

        if (symmetry.axis !== '')
            helper.setSymmPivot();

        if (preferences.getWebsocket())
            client.ws_send(voxels);
    }

    this.add = function(pos, hex, visible) {
        this.voxels.push({ position: pos, color: hex, visible: visible });
    }

    this.addNoDup = function(pos, hex, visible) {
        if (this.findIndexByPosition(pos) == -1) // no duplicates allowed
            this.voxels.push({ position: pos, color: hex, visible: visible });
    }

    this.remove = function(index) {
        index = this.voxels.indexOf(this.voxels[index]);
        if (index > -1)
            this.voxels.splice(index, 1);
    }

    this.removeByPosition = function(pos) {
        this.remove(this.findIndexByPosition(pos));
    }

    this.removeDuplicates = function() {
        const last = this.voxels.length;
        this.voxels = this.voxels.filter((value, index, self) =>
            index === self.findIndex(i =>
                i.position.x == value.position.x &&
                i.position.y == value.position.y &&
                i.position.z == value.position.z
            ));
        return last - this.voxels.length;
    }

    this.removeDuplicatesFunc = function() {
        engine.displayLoadingUI();
        setTimeout(() => {
            ui.notification(`found ${ this.removeDuplicates() } duplicates`);
            engine.hideLoadingUI();
        }, 100);
    }

    this.findIndexByPosition = function(pos) {
        return this.voxels.findIndex(i =>
            i.position.x == pos.x &&
            i.position.y == pos.y &&
            i.position.z == pos.z);
    }

    this.findIndexByColor = function(hex) {
        return this.voxels.findIndex(i => i.color == hex);
    }

    this.getVoxelsByPosition = function(pos) {
        return this.voxels.filter(i =>
            i.position.x == pos.x &&
            i.position.y == pos.y &&
            i.position.z == pos.z);
    }

    this.getVoxelsByColor = function(hex) {
        return this.voxels.filter(i => i.color == hex);
    }

    this.getVoxelsByVisibility = function(isVisible) {
        return this.voxels.filter(i => i.visible == isVisible);
    }

    this.setVoxelPosition = function(index, pos) {
        this.voxels[index].position = pos;
        this.SPS.particles[index].position = pos;
    }

    this.setVoxelColor = function(index, hex) {
        this.voxels[index].color = hex;
    }

    this.setAllVoxelColors = async function(hex = currentColor) {
        if (!await ui.showConfirm('replace all colors?')) return;
        for (let i = 0; i < this.voxels.length; i++)
            this.voxels[i].color = hex;
        this.createSPS();
        memory.record();
    }

    this.setVoxelVisible = function(index, visible) {
        this.voxels[index].visible = visible;
        this.SPS.particles[index].isVisible = visible;
    }

    this.setVoxelsVisibility = function(isVisible) {
        for (let i = 0; i < this.voxels.length; i++)
            this.setVoxelVisible(i, isVisible);
    }

    this.setVoxelsVisibilityAndUpdate = function(isVisible) {
        for (let i = 0; i < this.voxels.length; i++)
            this.setVoxelVisible(i, isVisible);
        this.createSPS();
        memory.record();
        light.updateShadowMap();
    }

    this.setMeshVisibility = function(isVisible) {
        this.SPS.mesh.isVisible = isVisible;
    }

    this.deleteHidden = function() {
        const hiddens = this.getVoxelsByVisibility(false);
        if (hiddens.length == 0) {
            ui.notification('no hidden voxels');
            return;
        }
        const len = this.voxels.length;
        for (let i = 0; i < hiddens.length; i++) {
            this.voxels.splice(this.voxels.indexOf(hiddens[i]), 1);
        }
        this.createSPS();
        if (this.voxels.length !== len)
            memory.record(); // record on changes
    }

    this.normalizeVoxelPositions = function(isRecordMem) {
        const bounds = this.SPS.mesh.getBoundingInfo();
        const size = getMeshSize(bounds);
        const center = bounds.boundingBox.center;
        const nX = -bounds.maximum.x + (size.x / 2);
        const nY = ((size.y / 2) - center.y) - 0.5;
        const nZ = -bounds.maximum.z + (size.z / 2);
        for (let i = 0; i < this.voxels.length; i++) {
            const transMatrix = BABYLON.Matrix.Translation(nX, nY, nZ);
            const position = BABYLON.Vector3.TransformCoordinates(this.voxels[i].position, transMatrix);
            this.setVoxelPosition(i, position);
        }
        this.SPS.setParticles();
        this.SPS.refreshVisibleSize();
        if (isRecordMem) {
            memory.record(); // record on changes
            ui.notification('normalized');
        }
        light.updateShadowMap();
    }

    this.reduceVoxels = async function() {
        if (!await ui.showConfirm('reducing voxels, continue?')) return;
        engine.displayLoadingUI();
        setTimeout(() => {
            const reduced = this.voxels.length;
            const toDelete = [];
            const idx = []; // remove voxels by testing 6 sides
            const test = [
                new BABYLON.Vector3(1, 0, 0),
                new BABYLON.Vector3(-1, 0, 0),
                new BABYLON.Vector3(0, 1, 0),
                new BABYLON.Vector3(0, -1, 0),
                new BABYLON.Vector3(0, 0, 1),
                new BABYLON.Vector3(0, 0, -1)
            ];
            for (let i = 0; i < this.voxels.length; i++) {
                idx[0] = this.findIndexByPosition(this.voxels[i].position.add(test[0]));
                idx[1] = this.findIndexByPosition(this.voxels[i].position.add(test[1]));
                idx[2] = this.findIndexByPosition(this.voxels[i].position.add(test[2]));
                idx[3] = this.findIndexByPosition(this.voxels[i].position.add(test[3]));
                idx[4] = this.findIndexByPosition(this.voxels[i].position.add(test[4]));
                idx[5] = this.findIndexByPosition(this.voxels[i].position.add(test[5]));
                if (idx[0] > -1 && idx[1] > -1 && idx[2] > -1 && idx[3] > -1 && idx[4] > -1 && idx[5] > -1)
                    toDelete.push(this.voxels[i]);
            }
            for (let i = 0; i < toDelete.length; i++) {
                this.voxels.splice(this.voxels.indexOf(toDelete[i]), 1);
            }
            this.createSPS();
            ui.notification(`${ reduced - this.voxels.length } voxels removed`);
            engine.hideLoadingUI();
        }, 100);
    }

    this.getData = function() { // raw io, used in Memory and Snapshot
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
        const newData = [];
        const voxels = data.split(';').slice(0, -1);
        for (let i = 0; i < voxels.length; i++) {
            const chunk = voxels[i].split(',');
            newData.push({ 
                position: new BABYLON.Vector3(
                    parseFloat(chunk[0]),
                    parseFloat(chunk[1]),
                    parseFloat(chunk[2])
                ),
                color: chunk[3],
                visible: parseBool(chunk[4])
            });
        }
        this.voxels = newData;
        this.createSPS();
        helper.setGrid();
    }

    // used in file, project and generator functions
    // except memory record, do after createSPS()
    // except symmetry axis, do after createSPS()
    this.loadData = function(data, isDupCheck = true, isNormalize = false) {
        this.voxels = []; // important
        for (let i = 0; i < data.length; i++) 
            this.add(data[i].position, data[i].color, data[i].visible);
        if (isDupCheck)
            this.removeDuplicates();
        this.createSPS();
        if (isNormalize)
            this.normalizeVoxelPositions(false);
        helper.setGrid();
        helper.resetWorkplane();
        uix.unbindWorkplane();
        uix.isWorkplane = false; // important, to keep it active
    }

    this.init();
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
            if (palette.uniqueColors.includes(hex)) {
                currentColor = hex;
                uix.colorPicker.value = BABYLON.Color3.FromHexString(hex);
            }
        }, false);

        canvasPalette.addEventListener("dblclick", (ev) => {
            const hex = getCanvasColor(ctx, ev.offsetX, ev.offsetY);
            if (palette.uniqueColors.includes(hex)) {
                palette.setColorVisible(hex, !palette.isColorVisible(hex));
                builder.createSPS();
                memory.record();
            }
        }, false);
    }

    this.create = function() {   // generate color palette
        const wPad = W + pad;
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

    this.expand = function(num) { // TODO: optimize
        ui.domPalette.style.width = 8 + ((W + pad) * num) + "px";
        canvasPalette.width = ui.domPalette.clientWidth;
        this.create();
    }
    
    this.addColor = function(x, y, hex) {
        ctx.strokeStyle = 'transparent';
        if (!this.isColorVisible(hex)) // respect the stored visibility state
            ctx.strokeStyle = 'orange';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, W, H);
        ctx.fillStyle = hex;
        ctx.fillRect(x, y, W, H);
    }

    this.setColorVisible = function(hex, isVisible) {
        const voxels = builder.getVoxelsByColor(hex);
        for (let i = 0; i < voxels.length; i++)
            voxels[i].visible = isVisible;
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
    this.groundPlane = BABYLON.MeshBuilder.CreatePlane("groundplane", { size: 2000, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, scene);
    this.gridPlane = BABYLON.MeshBuilder.CreatePlane("gridplane", { width: 3, height: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, scene);
    this.workPlane = BABYLON.MeshBuilder.CreatePlane("workplane", { size: 2000, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, scene);
    this.axisPlane = BABYLON.MeshBuilder.CreatePlane("axisplane", { width: 1.1, height: 1.1, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, sceneAxisView);
    this.symmPivot = BABYLON.MeshBuilder.CreateBox("symmpivot", { size: 0.5, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, uix.utilLayer.utilityLayerScene);
    this.overlayPlane = BABYLON.MeshBuilder.CreatePlane("overlayplane", { sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false }, scene);
    this.overlayCube = BABYLON.MeshBuilder.CreateBox("overlaycube", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
    this.ghostBox = BABYLON.MeshBuilder.CreateBox("ghostbox", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
    this.ghostBoxSymm = BABYLON.MeshBuilder.CreateBox("ghostboxsymm", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
    this.ghostVoxel = null;
    this.workplaneAxis = BABYLON.Axis.Y;

    this.init = function() {
        this.groundPlane.material = material.mat_grid_sandbox;
        this.groundPlane.isVisible = false; // for sandbox
        this.groundPlane.isPickable = false;
        this.groundPlane.checkCollisions = false; // initial
        this.groundPlane.position.y = -0.5;
        this.groundPlane.rotation.x = PIH;
        this.groundPlane.doNotSerialize = true;
        this.groundPlane.convertToUnIndexedMesh();
        this.groundPlane.freezeWorldMatrix();
        this.groundPlane.freezeNormals();
        
        this.gridPlane.material = material.mat_grid;
        this.gridPlane.isVisible = true;
        this.gridPlane.isPickable = false;
        this.gridPlane.position.y = -0.5;
        this.gridPlane.rotation.x = PIH;
        this.gridPlane.doNotSerialize = true;
        this.gridPlane.convertToUnIndexedMesh();
        this.gridPlane.freezeNormals();
        
        this.axisPlane.isVisible = false; // indicate symmetry-axis plane in AxisView scene
        this.axisPlane.isPickable = false;
        this.axisPlane.visibility = 0.3;
        this.axisPlane.renderOverlay = true;
        this.axisPlane.overlayAlpha = 0.5;
        this.axisPlane.overlayColor = BABYLON.Color3.FromHexString(COL_AQUA);
        this.axisPlane.edgesWidth = 10;
        this.axisPlane.edgesColor = BABYLON.Color4.FromHexString(COL_AQUA + 'FF');
        this.axisPlane.doNotSerialize = true;
        this.axisPlane.enableEdgesRendering();
        this.axisPlane.convertToUnIndexedMesh();
        this.axisPlane.freezeNormals();

        this.symmPivot.isVisible = false; // indicate symmetry pivot center
        this.symmPivot.isPickable = false;
        this.symmPivot.visibility = 0.01;
        this.symmPivot.position.y = -0.5;
        this.symmPivot.edgesWidth = 8;
        this.symmPivot.edgesColor = BABYLON.Color4.FromHexString(COL_AQUA + 'AA');
        this.symmPivot.doNotSerialize = true;
        this.symmPivot.enableEdgesRendering();
        this.symmPivot.convertToUnIndexedMesh();
        this.symmPivot.freezeNormals();

        this.overlayPlane.isVisible = false;
        this.overlayPlane.isPickable = false;
        this.overlayPlane.visibility = 0.1;
        this.overlayPlane.renderOverlay = true;
        this.overlayPlane.overlayColor = BABYLON.Color3.FromHexString(COL_ORANGE);
        this.overlayPlane.overlayAlpha = 0.5;
        this.overlayPlane.edgesWidth = 0; // overrided
        this.overlayPlane.edgesColor = BABYLON.Color4.FromHexString(COL_ORANGE + 'FF');
        this.overlayPlane.doNotSerialize = true;
        this.overlayPlane.enableEdgesRendering();
        this.overlayPlane.convertToUnIndexedMesh();
        this.overlayPlane.freezeNormals();

        this.overlayCube.isVisible = false;
        this.overlayCube.isPickable = false;
        this.overlayCube.visibility = 0.1;
        this.overlayCube.renderOverlay = true;
        this.overlayCube.overlayColor = BABYLON.Color3.FromHexString(COL_ORANGE);
        this.overlayCube.overlayAlpha = 0.5;
        this.overlayCube.edgesColor = BABYLON.Color4.FromHexString(COL_ORANGE + 'FF');
        this.overlayCube.edgesWidth = 0; // overrided
        this.overlayCube.doNotSerialize = true;
        this.overlayCube.enableEdgesRendering();
        this.overlayCube.convertToUnIndexedMesh();
        this.overlayCube.freezeNormals();

        this.ghostBox.isVisible = false;
        this.ghostBox.isPickable = false;
        this.ghostBox.visibility = 0.1;
        this.ghostBox.renderOverlay = true;
        this.ghostBox.overlayColor = BABYLON.Color3.FromHexString(COL_ORANGE);
        this.ghostBox.overlayAlpha = 0.5;
        this.ghostBox.edgesWidth = 0; // overrided
        this.ghostBox.edgesColor = BABYLON.Color4.FromHexString(COL_ORANGE + 'FF');
        this.ghostBox.doNotSerialize = true;
        this.ghostBox.enableEdgesRendering();
        this.ghostBox.convertToUnIndexedMesh();
        this.ghostBox.freezeNormals();

        this.ghostBoxSymm.renderingGroupId = 1;
        this.ghostBoxSymm.isVisible = false;
        this.ghostBoxSymm.isPickable = false;
        this.ghostBoxSymm.visibility = 0.1;
        this.ghostBoxSymm.edgesWidth = 0; // overrided
        this.ghostBoxSymm.edgesColor = BABYLON.Color4.FromHexString(COL_AQUA + '50');
        this.ghostBoxSymm.doNotSerialize = true;
        this.ghostBoxSymm.enableEdgesRendering();
        this.ghostBoxSymm.convertToUnIndexedMesh();
        this.ghostBoxSymm.freezeNormals();

        this.workPlane.material = material.mat_workplane;
        this.workPlane.isVisible = false;
        this.workPlane.isPickable = true;
        this.workPlane.visibility = 0.1;
        this.workPlane.renderOverlay = true;
        this.workPlane.overlayColor = BABYLON.Color3.FromHexString(COL_AQUA);
        this.workPlane.overlayAlpha = 0.05;
        this.workPlane.doNotSerialize = true;
        this.workPlane.convertToUnIndexedMesh();
        this.workPlane.freezeNormals();
        this.setWorkPlane(this.workplaneAxis); // initial

        this.clearGhostVoxels(); // init
    }

    this.setGrid = function() {
        setTimeout(() => {
            const radius = 2 * builder.SPS.mesh.getBoundingInfo().boundingSphere.radius;
            this.gridPlane.scaling.x = radius;
            this.gridPlane.scaling.y = radius;
            this.gridPlane.scaling.z = radius;
            this.gridPlane.material.gridRatio = 1 / radius;
        }, 100);
    }

    this.toggleWorkplane = function() {
        this.workPlane.isVisible = !this.workPlane.isVisible;
        uix.isWorkplane = this.workPlane.isVisible;
        (this.workPlane.isVisible) ? uix.bindWorkplane() : uix.unbindWorkplane();
    }

    this.setWorkPlane = function(axis) { // BABYLON.Axis.X
        this.workplaneAxis = axis;
        this.workPlane.rotation = BABYLON.Vector3.Zero();
        if (axis.x == 1) this.workPlane.rotation.y = PIH;
        if (axis.y == 1) this.workPlane.rotation.x = PIH;
        if (axis.z == 1) this.workPlane.rotation.z = PIH;
    }

    this.resetWorkplane = async function(isAlert = false) {
        if (isAlert && !await ui.showConfirm('reset workplane?')) return;
        this.workPlane.position.x = 0;
        this.workPlane.position.y = -0.5;
        this.workPlane.position.z = 0;
        this.setWorkPlane(BABYLON.Axis.Y);
    }

    this.setAxisPlane = function(axis, pos) {
        this.axisPlane.isVisible = true;
        this.axisPlane.position = pos;
        this.axisPlane.rotation = BABYLON.Vector3.Zero();
        if (axis.x == 1) this.axisPlane.rotation.y = PIH;
        if (axis.y == 1) this.axisPlane.rotation.x = PIH;
        if (axis.z == 1) this.axisPlane.rotation.z = PIH;
    }

    this.setSymmPivot = function() {
        this.symmPivot.isVisible = (symmetry.axis !== '');
        if (ui.domSymmCenter.checked) { // world
            this.symmPivot.position = BABYLON.Vector3.Zero();
        } else { // local
            this.symmPivot.position = builder.SPS.mesh.getBoundingInfo().boundingSphere.centerWorld;
        }
    }

    this.toggleAxisPlane = function(isVisible) {
        this.axisPlane.isVisible = isVisible;
        this.symmPivot.isVisible = isVisible;
    }

    this.setOverlayPlane = function(pos, normAxis, hex = COL_ORANGE) {
        this.overlayPlane.isVisible = true;
        this.overlayPlane.position = pos;
        this.overlayPlane.rotationQuaternion = BABYLON.Quaternion.RotationAxis(
            BABYLON.Vector3.Cross(BABYLON.Axis.Z, normAxis),         // axis
            Math.acos(BABYLON.Vector3.Dot(normAxis, BABYLON.Axis.Z)) // angle
        );
        this.overlayPlane.overlayColor = BABYLON.Color3.FromHexString(hex);
        this.overlayPlane.edgesColor = BABYLON.Color4.FromHexString(hex + 'FF');
        this.overlayPlane.edgesWidth = scene.activeCamera.radius/5;
    }

    this.setOverlayCube = function(pos, hex = COL_ORANGE) {
        this.overlayCube.isVisible = true;
        this.overlayCube.position = pos;
        this.overlayCube.overlayColor = BABYLON.Color3.FromHexString(hex);
        this.overlayCube.edgesColor = BABYLON.Color4.FromHexString(hex + 'FF');
        this.overlayCube.edgesWidth = scene.activeCamera.radius/5;
    }

    this.clearOverlays = function() {
        this.overlayCube.isVisible = false;
        this.overlayPlane.isVisible = false;
    }

    this.drawGhostBox = function(pos, scale, hex) {
        this.ghostBox.isVisible = true;
        this.ghostBox.position = pos;
        this.ghostBox.scaling = scale;
        this.ghostBox.overlayColor = BABYLON.Color3.FromHexString(hex);
        this.ghostBox.edgesWidth = scene.activeCamera.radius/5;
    }

    this.drawGhostBoxSymmetry = function(pos, scale, hex) {
        this.ghostBoxSymm.isVisible = true;
        this.ghostBoxSymm.position = pos;
        this.ghostBoxSymm.scaling = scale;
        this.ghostBoxSymm.overlayColor = BABYLON.Color3.FromHexString(hex);
        this.ghostBoxSymm.edgesWidth = scene.activeCamera.radius/5;
    }

    this.clearGhostBox = function() {
        this.ghostBox.isVisible = false;
        this.ghostBox.position = BABYLON.Vector3.Zero();
        this.ghostBox.scaling = BABYLON.Vector3.Zero();
        this.ghostBoxSymm.isVisible = false;
        this.ghostBoxSymm.position = BABYLON.Vector3.Zero();
        this.ghostBoxSymm.scaling = BABYLON.Vector3.Zero();
    }

    this.cloneGhostVoxel = function(pos, hex = '#C58A1B') {
        this.ghostVoxel.isVisible = true;
        this.ghostVoxel.material.diffuseColor = BABYLON.Color3.FromHexString(hex);
        this.ghostVoxel.thinInstanceAdd( BABYLON.Matrix.Translation(pos.x, pos.y, pos.z) );
    }

    this.clearGhostVoxels = function() {
        if (this.ghostVoxel) // dispose all instances
            this.ghostVoxel.dispose();
        this.ghostVoxel = BABYLON.MeshBuilder.CreateBox("ghostvoxel", { size: 1, sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, scene);
        this.ghostVoxel.material = material.mat_ghost;
        this.ghostVoxel.isVisible = false;
    }

    this.init();
}


// -------------------------------------------------------
// Tool, ToolBakery


function Tool(scene) {
    const workplaneWhiteList = [
        'add', 'remove', 'boxadd', 'boxrem', 'boxpaint', 'boxhide', 'fill'
    ];
    this.name = 'camera';
    this.selected = [];
    this.isMouseDown = false;
    this.lastCamPos = null;
    this.pick = null;
    let startPos = null;
    let selVoxels = [];
    let isWP = false;

    this.init = function() {
        this.toolSelector(this.name); // startup tool
    }

    this.add = function(pos) {
        helper.cloneGhostVoxel(pos, currentColor);
        this.selected.push(pos);
    }

    this.addNoHelper = function(pos) {
        this.selected.push(pos);
        if (symmetry.axis !== '')
            this.selected.push(symmetry.invertPos(pos));
    }

    this.addSymmetry = function(pos) {
        pos = symmetry.invertPos(pos);
        this.add(pos);
    }

    this.remove = function(pos) {
        helper.cloneGhostVoxel(pos, COL_DELETE);
        this.selected.push(pos); // removing voxels onToolUp to prevent infinite-depth picking
    }

    this.removeNoHelper = function(pos) {
        this.selected.push(pos);
        if (symmetry.axis !== '')
            this.selected.push(symmetry.invertPos(pos));
    }

    this.removeSymmetry = function(pos) {
        this.remove(symmetry.invertPos(pos));
    }

    this.paint = function(index, pos) {
        builder.setVoxelColor(index, currentColor);
        helper.cloneGhostVoxel(pos, currentColor);
    }

    this.paintSymmetry = function(pos) {
        const index = symmetry.findIndexInvert(pos);
        if (index > -1) {
            builder.setVoxelColor(index, currentColor);
            helper.cloneGhostVoxel(builder.voxels[index].position, currentColor);
        }
    }

    this.eyedrop = function(hex) {
        currentColor = hex;
        uix.colorPicker.value = BABYLON.Color3.FromHexString(currentColor);
    }

    this.bucket = function(hex) {
        for (let i = 0; i < builder.voxels.length; i++) {
            if (builder.voxels[i].color === hex)
                builder.voxels[i].color = currentColor;
        }
    }

    this.hideColor = function(hex) {
        palette.setColorVisible(hex, false);
    }

    this.isolateColor = function(hex) {
        builder.setVoxelsVisibility(false);
        palette.setColorVisible(hex, true);
    }
    
    this.bakeColor = function(hex) {
        bakery.bakeColor(hex);
    }

    this.pull = function(posBegin, posEnd, index) {
        for (let i = 0; i < this.selected.length; i++) { // prevent infinite-depth picking
            if (this.selected[i].equals(posBegin))
                return;
        }
        if (builder.findIndexByPosition(posEnd) == -1) {  // no duplicates on merge,
            builder.setVoxelPosition(index, posEnd);      // e.g. transform cause a merge of two parallel voxels
            builder.SPS.setParticles(index, index, true);
            this.selected.push(posEnd);
        }
    }

    this.pullSymmetry = function(posBegin, posEnd, index, axis) {
        index = symmetry.findIndexInvert(posBegin, axis);
        if (index == -1) return;
        posEnd = symmetry.invertPos(posEnd, axis);
        this.pull(posBegin, posEnd, index);
    }

    this.pullColor = function(norm, hex) {
        for (let i = 0; i < builder.voxels.length; i++) {
            if (builder.voxels[i].color == hex)
                builder.voxels[i].position.addInPlace(norm);
        }
    }

    let fixedHeight = 0;
    let sX,sY,sZ, eX,eY,eZ;
    this.box = function(startPos, endPos, isAdd, hex = null) {
        if (isAdd && fixedHeight > 0) // enable wall drawing
            endPos.y = startPos.y + fixedHeight - 1;

        if (endPos.x <= startPos.x && endPos.y <= startPos.y && endPos.z <= startPos.z) {
            sX = endPos.x;      eX = startPos.x;
            sY = endPos.y;      eY = startPos.y;
            sZ = endPos.z;      eZ = startPos.z;
        }
        else if (startPos.x <= endPos.x && startPos.y <= endPos.y && startPos.z <= endPos.z) {
            sX = startPos.x;    eX = endPos.x;
            sY = startPos.y;    eY = endPos.y;
            sZ = startPos.z;    eZ = endPos.z;
        }

        else if (endPos.x <= startPos.x && startPos.y <= endPos.y && endPos.z <= startPos.z) {
            sX = endPos.x;      eX = startPos.x;
            sY = startPos.y;    eY = endPos.y;
            sZ = endPos.z;      eZ = startPos.z;
        }
        else if (startPos.x <= endPos.x && endPos.y <= startPos.y && startPos.z <= endPos.z) {
            sX = startPos.x;    eX = endPos.x;
            sY = endPos.y;      eY = startPos.y;
            sZ = startPos.z;    eZ = endPos.z;
        }

        else if (startPos.x <= endPos.x && endPos.y <= startPos.y && endPos.z <= startPos.z) {
            sX = startPos.x;    eX = endPos.x;
            sY = endPos.y;      eY = startPos.y;
            sZ = endPos.z;      eZ = startPos.z;
        }
        else if (endPos.x <= startPos.x && startPos.y <= endPos.y && startPos.z <= endPos.z) {
            sX = endPos.x;      eX = startPos.x;
            sY = startPos.y;    eY = endPos.y;
            sZ = startPos.z;    eZ = endPos.z;
        }

        else if (startPos.x <= endPos.x && startPos.y <= endPos.y && endPos.z <= startPos.z) {
            sX = startPos.x;    eX = endPos.x;
            sY = startPos.y;    eY = endPos.y;
            sZ = endPos.z;      eZ = startPos.z;
        }
        else if (endPos.x <= startPos.x && endPos.y <= startPos.y && startPos.z <= endPos.z) {
            sX = endPos.x;      eX = startPos.x;
            sY = endPos.y;      eY = startPos.y;
            sZ = startPos.z;    eZ = endPos.z;
        }

        helper.drawGhostBox(
            startPos.add(endPos).divide(new BABYLON.Vector3(2, 2, 2)),
                new BABYLON.Vector3(1 + eX - sX, 1 + eY - sY, 1 + eZ - sZ),
                hex);
        
        if (symmetry.axis !== '') {
            helper.drawGhostBoxSymmetry(
                symmetry.invertPos(startPos).add(symmetry.invertPos(endPos)).divide(new BABYLON.Vector3(2, 2, 2)),
                    new BABYLON.Vector3(1 + eX - sX, 1 + eY - sY, 1 + eZ - sZ),
                    hex);
        }

        this.selected = [];
        for (let x = sX; x <= eX; x++) {
            for (let y = sY; y <= eY; y++) {
                for (let z = sZ; z <= eZ; z++) {
                    this.selected.push(new BABYLON.Vector3(x, y, z));
                }
            }
        }
    }

    function castRay(pos) { // TODO: slow raycast
        const ray = BABYLON.Ray.CreateNewFromTo(
            camera.camera0.position.clone().scale(0.5), pos);
        //BABYLON.RayHelper.CreateAndShow(ray, scene, new BABYLON.Color3(0, 1, 1));
        return !ray.intersectsMesh(builder.SPS.mesh, true).hit; // equals to (if hit ghostVoxels)
    }

    this.fill = function(norm) {
        const endPos = { x: scene.pointerX, y: scene.pointerY };
        const minX = Math.min(startPos.x, endPos.x);
        const minY = Math.min(startPos.y, endPos.y);
        const maxX = Math.max(startPos.x, endPos.x);
        const maxY = Math.max(startPos.y, endPos.y);
        ui.domMarquee.style.top = minY + 'px';
        ui.domMarquee.style.left = minX + 'px';
        ui.domMarquee.style.width = maxX - minX + 'px';
        ui.domMarquee.style.height = maxY - minY + 'px';

        selVoxels = builder.voxels.filter((i) => 
            isTargetIn(startPos, endPos, i.position, scene.activeCamera));

        this.selected = [];
        helper.clearGhostVoxels();
        for (let i = 0; i < selVoxels.length; i++) {
            const pos = selVoxels[i].position.add(norm);
            if (castRay(pos)) {
                helper.cloneGhostVoxel(pos, currentColor);
                this.selected.push(pos);
            }
        }
    }

    this.pickWorkplane = function(pick, norm) {
        norm.x = parseFloat(norm.x.toFixed(3));
        norm.y = parseFloat(norm.y.toFixed(3)); // fix workplane precision issue
        norm.z = parseFloat(norm.z.toFixed(3));

        const pos = pick.pickedPoint.floor();
        if (helper.workplaneAxis.x == 1) {
            if (norm.x < 0) pos.x = helper.workPlane.position.x + 0.5;
            if (norm.x > 0) pos.x = helper.workPlane.position.x - 0.5;
            pos.y += 1;
            pos.z += 0.5;
        }
        else if (helper.workplaneAxis.y == 1) {
            pos.x += 0.5;
            if (norm.y < 0) pos.y = helper.workPlane.position.y + 0.5;
            if (norm.y > 0) pos.y = helper.workPlane.position.y - 0.5;
            pos.z += 0.5;
        }
        else if (helper.workplaneAxis.z == 1) {
            pos.x += 0.5;
            pos.y += 1;
            if (norm.z < 0) pos.z = helper.workPlane.position.z + 0.5;
            if (norm.z > 0) pos.z = helper.workPlane.position.z - 0.5;
        }
        return pos;
    }

    this.onToolDown = function(pick) {
        if (pick && pick.faceId == -1) return;
        if (!this.pauseCameraControls()) return;
        const index = builder.SPS.pickedParticles[pick.faceId].idx;
        const norm = pick.getNormal(true);
        let pos = builder.SPS.particles[index].position;
        isWP = false;

        if (pick.pickedMesh == helper.workPlane) {
            if (!workplaneWhiteList.includes(this.name))
                return;
            pos = this.pickWorkplane(pick, norm);
            isWP = true;
        }

        switch (this.name) {
            case 'add':
                this.add(pos.add(norm));
                if (symmetry.axis !== '')
                    this.addSymmetry(pos.add(norm));
                break;
            case 'remove':
                if (!isWP) {
                    this.remove(pos);
                    if (symmetry.axis !== '')
                        this.removeSymmetry(pos);
                } else {
                    this.remove(pos.add(norm));
                    if (symmetry.axis !== '')
                        this.removeSymmetry(pos.add(norm));
                }
                break;
            case 'pull':
                this.pull(pos, pos.add(norm), index);
                if (symmetry.axis !== '')
                    this.pullSymmetry(pos, pos.add(norm), index, symmetry.axis);
                light.updateShadowMap(); // important
                break;
            case 'pullcolor':
                this.pullColor(norm, builder.voxels[index].color);
                light.updateShadowMap();
                break;
            case 'paint':
                this.paint(index, pos);
                if (symmetry.axis !== '')
                    this.paintSymmetry(pos);
                break;
            case 'eyedrop':
                this.eyedrop(builder.voxels[index].color);
                break;
            case 'bucket':
                this.bucket(builder.voxels[index].color);
                break;
            case 'hidecolor':
                this.hideColor(builder.voxels[index].color);
                break;
            case 'isolatecolor':
                this.isolateColor(builder.voxels[index].color);
                break;
            case 'bakecolor':
                this.bakeColor(builder.voxels[index].color);
                break;
            case 'boxadd':
                this.addNoHelper(pos.add(norm)); // alow 1 voxel drawing
                startPos = pos.add(norm);
                fixedHeight = parseInt(ui.domBoxToolHeight.value);
                break;
            case 'boxrem':
                this.removeNoHelper(pos);
                startPos = pos;
                break;
            case 'boxpaint':
                this.selected.push(pos);
                startPos = pos;
                break;
            case 'boxhide':
                this.selected.push(pos);
                startPos = pos;
                break;
            case 'fill':
                startPos = { x: scene.pointerX, y: scene.pointerY };
                ui.domMarquee.style.display = 'unset';
                break;
        }
    }

    this.onToolMove = function(pick) {
        if (pick && pick.faceId == -1) return;
        const index = builder.SPS.pickedParticles[pick.faceId].idx;
        const norm = pick.getNormal(true);
        let pos = builder.SPS.particles[index].position;
        isWP = false;

        if (pick.pickedMesh == helper.workPlane) {
            if (!workplaneWhiteList.includes(this.name))
                return;
            pos = this.pickWorkplane(pick, norm);
            isWP = true;
        }

        switch (this.name) {
            case 'add':
                helper.setOverlayPlane(pos.add(norm.scale(0.5)), norm);
                if (this.isMouseDown && this.pauseCameraControls()) {
                    this.add(pos.add(norm));
                    if (symmetry.axis !== '')
                        this.addSymmetry(pos.add(norm));
                }
                break;
            case 'remove':
                if (!isWP) {
                    helper.setOverlayCube(pos, COL_DELETE);
                    if (this.isMouseDown && this.pauseCameraControls()) {
                        this.remove(pos);
                        if (symmetry.axis !== '')
                            this.removeSymmetry(pos);
                    }
                } else {
                    helper.setOverlayCube(pos.add(norm), COL_DELETE);
                    if (this.isMouseDown && this.pauseCameraControls()) {
                        this.remove(pos.add(norm));
                        if (symmetry.axis !== '')
                            this.removeSymmetry(pos.add(norm));
                    }
                }
                break;
            case 'pull':
                helper.setOverlayPlane(pos.add(norm.scale(0.5)), norm);
                if (this.isMouseDown && this.pauseCameraControls()) {
                    this.pull(pos, pos.add(norm), index);
                    if (symmetry.axis !== '')
                        this.pullSymmetry(pos, pos.add(norm), index, symmetry.axis);
                    light.updateShadowMap(); // important
                }
                break;
            case 'pullcolor':
                helper.setOverlayPlane(pos.add(norm.scale(0.5)), norm);
                break;
            case 'paint':
                helper.setOverlayCube(pos);
                if (this.isMouseDown && this.pauseCameraControls()) {
                    this.paint(index, pos);
                    if (symmetry.axis !== '')
                        this.paintSymmetry(pos);
                }
                break;
            case 'eyedrop':
                helper.setOverlayCube(pos);
                if (this.isMouseDown && this.pauseCameraControls())
                    this.eyedrop(builder.voxels[index].color);
                break;
            case 'bucket':
                helper.setOverlayCube(pos);
                break;
            case 'hidecolor':
                helper.setOverlayCube(pos);
                break;
            case 'isolatecolor':
                helper.setOverlayCube(pos);
                break;
            case 'bakecolor':
                helper.setOverlayCube(pos);
                break;
            case 'boxadd':
                helper.setOverlayPlane(pos.add(norm.scale(0.5)), norm);
                if (startPos && this.isMouseDown && this.pauseCameraControls())
                    this.box(startPos, pos.add(norm), true, currentColor);
                break;
            case 'boxrem':
                if (!isWP) {
                    helper.setOverlayCube(pos, COL_DELETE);
                    if (startPos && this.isMouseDown && this.pauseCameraControls())
                        this.box(startPos, pos, false, COL_DELETE);
                } else {
                    helper.setOverlayCube(pos.add(norm), COL_DELETE);
                    if (startPos && this.isMouseDown && this.pauseCameraControls())
                        this.box(startPos.add(norm), pos.add(norm), false, COL_DELETE);
                }
                break;
            case 'boxpaint':
                helper.setOverlayCube(pos);
                if (startPos && this.isMouseDown && this.pauseCameraControls())
                    this.box(startPos, pos, false, currentColor);
                break;
            case 'boxhide':
                if (!isWP) {
                    helper.setOverlayCube(pos);
                    if (startPos && this.isMouseDown && this.pauseCameraControls())
                        this.box(startPos, pos, false, COL_HIDE);
                } else {
                    helper.setOverlayCube(pos.add(norm));
                    if (startPos && this.isMouseDown && this.pauseCameraControls())
                        this.box(startPos.add(norm), pos.add(norm), false, COL_HIDE);
                }
                break;
            case 'fill':
                helper.setOverlayPlane(pos.add(norm.scale(0.5)), norm);
                if (this.isMouseDown && this.pauseCameraControls())
                    this.fill(norm);
                break;
        }
    }

    this.onToolUp = function() {
        if (!this.pauseCameraControls()) return;
        switch (this.name) {
            case 'add':
                if (this.selected.length > 0) {
                    for (let i = 0; i < this.selected.length; i++)
                        builder.addNoDup(this.selected[i], currentColor, true);
                    builder.createSPS();
                    memory.record();
                }
                break;
            case 'remove':
                if (this.selected.length > 0) {
                    for (let i = 0; i < this.selected.length; i++)
                        builder.removeByPosition(this.selected[i]);
                    builder.createSPS();
                    memory.record();
                }
                break;
            case 'pull':
                builder.createSPS();
                memory.record();
                break;
            case 'pullcolor':
                builder.createSPS();
                memory.record();
                break;
            case 'paint':
                builder.createSPS();
                memory.record();
                break;
            case 'bucket':
                builder.createSPS();
                memory.record();
                break;
            case 'hidecolor':
                builder.createSPS();
                memory.record();
                break;
            case 'isolatecolor':
                builder.createSPS();
                memory.record();
                break;
            case 'bakecolor':
                break;
            case 'boxadd':
                if (this.selected.length > 0) {
                    for (let i = 0; i < this.selected.length; i++) {
                        builder.addNoDup(this.selected[i], currentColor, true);
                        if (symmetry.axis !== '')
                            builder.addNoDup(symmetry.invertPos(this.selected[i]), currentColor, true);
                    }
                    builder.createSPS();
                    memory.record();
                }
                break;
            case 'boxrem':
                if (this.selected.length > 0) {
                    for (let i = 0; i < this.selected.length; i++) {
                        builder.removeByPosition(this.selected[i]);
                        if (symmetry.axis !== '')
                            builder.removeByPosition(symmetry.invertPos(this.selected[i]));
                    }
                    builder.createSPS();
                    memory.record();
                }
                break;
            case 'boxpaint':
                if (this.selected.length > 0) {
                    for (let i = 0; i < this.selected.length; i++) {
                        let idx = builder.findIndexByPosition(this.selected[i]);
                        if (idx > -1) {
                            builder.voxels[idx].color = currentColor;
                            if (symmetry.axis !== '') {
                                idx = builder.findIndexByPosition(symmetry.invertPos(this.selected[i]));
                                if (idx > -1)
                                    builder.voxels[idx].color = currentColor;
                            }
                        }
                    }
                    builder.createSPS();
                    memory.record();
                }
                break;
            case 'boxhide':
                if (this.selected.length > 0) {
                    for (let i = 0; i < this.selected.length; i++) {
                        let idx = builder.findIndexByPosition(this.selected[i]);
                        if (idx > -1) {
                            builder.setVoxelVisible(idx, false);
                            if (symmetry.axis !== '') {
                                idx = builder.findIndexByPosition(symmetry.invertPos(this.selected[i]));
                                if (idx > -1)
                                    builder.setVoxelVisible(idx, false);
                            }
                        }
                    }
                    builder.SPS.setParticles();
                    palette.create();
                    memory.record();
                    light.updateShadowMap();
                }
                break;
            case 'fill':
                if (this.selected.length > 0) {
                    for (let i = 0; i < this.selected.length; i++)
                        builder.addNoDup(this.selected[i], currentColor, true);
                    builder.createSPS();
                    memory.record();
                }
                break;
        }
    }

    const predicate = function(mesh) {
        if (helper.workPlane.isVisible) {
            return mesh.name == 'SPS' || mesh == helper.workPlane;
        } else {
            return mesh.name == 'SPS';
        }
    };

    this.handleToolDown = function() {
        this.isMouseDown = true;
        this.lastCamPos = scene.activeCamera.position.clone();
        if (this.name !== 'camera') {
            this.pick = scene.pick(scene.pointerX, scene.pointerY, predicate);
            tool.onToolDown(this.pick);
            if (helper.workPlane.isVisible)
                uix.setWorkplaneGizmoVisibility(0.3);
        }
    }

    this.handleToolMove = function() {
        if (this.name !== 'camera') { // speed up navigation
            setTimeout(() => {
                this.pick = scene.pick(scene.pointerX, scene.pointerY, predicate);
                if (this.pick.hit) {
                    tool.onToolMove(this.pick);
                } else {
                    helper.clearOverlays(); // important: prevent last ghost/overlay after drawing
                }
            }, FPS_TOOLMOVE);
        }
    }

    this.handleToolUp = function() {
        this.isMouseDown = false;
        tool.onToolUp();
        
        selVoxels = [];
        this.selected = [];
        helper.clearGhostBox();
        helper.clearGhostVoxels();
        setTimeout(() => { // a little hack to prevent last ghost/overlay in touchscreen
            helper.clearOverlays();
        }, 10);
        ui.domMarquee.style = "display: none; left: 0; top: 0; width: 0; height: 0;";
        
        helper.setGrid();
        if (helper.workPlane.isVisible)
            uix.setWorkplaneGizmoVisibility(1);

        scene.activeCamera.attachControl(canvas, true);
    }

    this.toolSelector = function(toolName) {
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

        helper.clearOverlays();
    }

    this.pauseCameraControls = function() { // prevent drawing and camera-control conflict
        if (!this.lastCamPos.equals(scene.activeCamera.position)) {
            return false;
        } else {
            scene.activeCamera.detachControl(canvas);
            return true;
        }
    }

    this.init();
}

function ToolBakery(scene) {
    this.name = 'xform';
    this.selected = [];
    this.pick = null;

    this.onToolDown = function() {
        this.pick = scene.pick(scene.pointerX, scene.pointerY, (mesh) => {
            return bakery.meshes.includes(mesh);
        });

        if (!this.pick.hit) {
            bakery.deselectMesh();
            uix.unbindTransformGizmo();
            return;
        }

        switch (this.name) {
            case 'xform': // bind transform gizmo to baked meshes
                bakery.deselectMesh();
                uix.bindTransformGizmo([this.pick.pickedMesh]);
                break;
            case 'merge': // merge by select and apply
                const idx = this.selected.indexOf(this.pick.pickedMesh);
                if (idx == -1) {
                    this.selected.push(this.pick.pickedMesh);
                    this.pick.pickedMesh.edgesWidth = 4;
                    this.pick.pickedMesh.edgesColor = BABYLON.Color4.FromHexString(COL_ORANGE + 'FF');
                    this.pick.pickedMesh.enableEdgesRendering();
                } else {
                    this.selected.splice(idx, 1);
                    this.pick.pickedMesh.disableEdgesRendering();
                }
                break;
        }
    }

    this.onToolMove = function() {
        //
    }

    this.onToolUp = function() {
        //
    }

    this.mergeBakes = function() {
        if (this.selected.length == 1) {
            ui.notification('pick more bakes...');
            return;
        }
        if (this.selected.length > 1) {
            for (let i = 0; i < bakery.meshes.length; i++)
                bakery.meshes[i].renderOverlay = false;

            bakery.mergeSelected(this.selected);

            for (let i = 0; i < this.selected.length; i++)
                this.selected[i].disableEdgesRendering();

            this.selected = [];
            this.toolSelector('xform');
        } else {
            ui.notification('select bakes and hit merge');
        }
    }

    this.cancelTools = function() {
        if (this.selected.length > 0) {
            for (let i = 0; i < this.selected.length; i++)
                this.selected[i].disableEdgesRendering();
            this.selected = [];
        }
        this.toolSelector('xform');
    }

    this.onGizmoAttached = function(mesh) {
        bakery.deselectMesh(); // on user select
        bakery.selectMesh(mesh);
        bakery.getMaterial();
    }

    this.toolSelector = function(toolName) {
        this.name = toolName;

        for (const i of document.querySelectorAll('li'))
            if (i.classList.contains("tool_bakery_selector"))
                i.classList.remove("tool_bakery_selector");
        for (const i of document.querySelectorAll('button'))
            if (i.classList.contains("tool_bakery_selector"))
                i.classList.remove("tool_bakery_selector");
        const elem = document.getElementsByClassName('tool_' + this.name)[0];
        if (elem) elem.classList.add("tool_bakery_selector");

        bakery.deselectMesh();
        uix.unbindTransformGizmo();
    }
}


// -------------------------------------------------------
// Symmetry


function Symmetry() {
    this.axis = ''; // 'x'

    this.setAxis = function(axis) {
        this.axis = axis;
        helper.toggleAxisPlane(false);
        helper.setSymmPivot();
        if (axis == 'x') {
            helper.setAxisPlane(BABYLON.Axis.X, BABYLON.Vector3.Zero());
            ui.domSymmAxis.innerHTML = 'X';
            ui.domSymmAxis.style.color = COL_AXIS_X;
            ui.domSymmAxis2.innerHTML = 'X';
            ui.domSymmAxis2.style.color = COL_AXIS_X;
        } else if (axis == 'y') {
            helper.setAxisPlane(BABYLON.Axis.Y, BABYLON.Vector3.Zero());
            ui.domSymmAxis.innerHTML = 'Y';
            ui.domSymmAxis.style.color = COL_AXIS_Y;
            ui.domSymmAxis2.innerHTML = 'Y';
            ui.domSymmAxis2.style.color = COL_AXIS_Y;
        } else if (axis == 'z') {
            helper.setAxisPlane(BABYLON.Axis.Z, BABYLON.Vector3.Zero());
            ui.domSymmAxis.innerHTML = 'Z';
            ui.domSymmAxis.style.color = COL_AXIS_Z;
            ui.domSymmAxis2.innerHTML = 'Z';
            ui.domSymmAxis2.style.color = COL_AXIS_Z;
        } else {
            ui.domSymmAxis.innerHTML = 'None';
            ui.domSymmAxis.style.color = '#98a1ac';
            ui.domSymmAxis2.innerHTML = 'S';
            ui.domSymmAxis2.style.color = COL_AQUA + 'AA';
        }
    }

    this.switchAxis = function() {
        if (this.axis == '') {
            this.setAxis('x');
        } else if (this.axis == 'x') {
            this.setAxis('y');
        } else if (this.axis == 'y') {
            this.setAxis('z');
        } else if (this.axis == 'z') {
            this.setAxis('');
            this.resetAxis();
        }
    }

    this.resetAxis = function() {
        this.setAxis('');
    }

    this.symmetrizeVoxelPositions = function(side) {
        if (this.axis == '') {
            ui.notification('select symmetry axis');
            return;
        }
        builder.setVoxelsVisibility(true);
        if (side == 1) { // pos-to-neg
            this.deleteHalf(1);
            this.mirrorVoxels();
        } else { // neg-to-pos
            this.deleteHalf(-1);
            this.mirrorVoxels();
        }
        builder.createSPS();
        memory.record();
    }

    this.mirrorVoxelPositions = function() {
        if (this.axis == '') {
            ui.notification('select symmetry axis');
            return;
        }
        builder.setVoxelsVisibility(true);
        this.invertVoxels();
        builder.createSPS();
        memory.record();
    }

    this.deleteHalfVoxels = function(side) {
        if (this.axis == '') {
            ui.notification('select symmetry axis');
            return;
        }
        builder.setVoxelsVisibility(true);
        this.deleteHalf(side);
        builder.createSPS();
        memory.record();
    }

    this.deleteHalf = function(side) { // preserve 0 borders, prevent duplicates at the middle
        for (let i = 0; i < builder.SPS.particles.length; i++) { // reminder: 0.00000001 for vertex, voxel is 1.0, >=0.1 is more than enough!
            const p = builder.SPS.particles[i].position;
            if (this.axis == 'x') {
                if (side == -1 && this.center(p.x) <= -0.1) builder.removeByPosition(p);
                if (side == 1  && this.center(p.x) >= 0.1)  builder.removeByPosition(p);
            }
            if (this.axis == 'y') {
                if (side == -1 && this.center(p.y) <= -0.1) builder.removeByPosition(p);
                if (side == 1  && this.center(p.y) >= 0.1)  builder.removeByPosition(p);
            }
            if (this.axis == 'z') {
                if (side == -1 && this.center(p.z) <= -0.1) builder.removeByPosition(p);
                if (side == 1  && this.center(p.z) >= 0.1)  builder.removeByPosition(p);
            }
        }
    }

    this.mirrorVoxels = function() {
        for (let i = 0; i < builder.voxels.length; i++)
            builder.addNoDup(this.invertPos(builder.voxels[i].position), builder.voxels[i].color, true);
    }

    this.invertVoxels = function() {
        for (let i = 0; i < builder.voxels.length; i++)
            builder.voxels[i].position = this.invertPos(builder.voxels[i].position);
    }

    this.invertPos = function(pos) { // invert positive to negative and reverse
        if (this.axis == 'x') pos = new BABYLON.Vector3(this.center2(pos.x), pos.y, pos.z);
        if (this.axis == 'y') pos = new BABYLON.Vector3(pos.x, this.center2(pos.y), pos.z);
        if (this.axis == 'z') pos = new BABYLON.Vector3(pos.x, pos.y, this.center2(pos.z));
        return pos;
    }

    this.center = function(p) { // calculate position from center
        if (ui.domSymmCenter.checked) { // world center
            if (this.axis == 'x') return -p;
            if (this.axis == 'y') return -p;
            if (this.axis == 'z') return -p;
        } else { // local center
            const center = builder.SPS.mesh.getBoundingInfo().boundingBox.centerWorld;
            if (this.axis == 'x') return center.x - p;
            if (this.axis == 'y') return center.y - p;
            if (this.axis == 'z') return center.z - p;
        }
    }

    this.center2 = function(p) { // calculate position from center*2
        if (ui.domSymmCenter.checked) { // world center
            if (this.axis == 'x') return -p;
            if (this.axis == 'y') return -p;
            if (this.axis == 'z') return -p;
        } else { // local center
            const center = builder.SPS.mesh.getBoundingInfo().boundingBox.centerWorld;
            if (this.axis == 'x') return (center.x * 2) - p;
            if (this.axis == 'y') return (center.y * 2) - p;
            if (this.axis == 'z') return (center.z * 2) - p;
        }
    }

    this.findIndexInvert = function(pos) {
        // return index at mirrored position, or '-1' if not exist
        return builder.findIndexByPosition(this.invertPos(pos));
    }
}


// -------------------------------------------------------
// Voxelizer


function Voxelizer(scene) {
    this.voxelize = function(mesh) {
        const scale = parseInt(document.getElementById('input-voxelizer-scale').value);
        
        normalizeMesh(mesh, scale);

        const data = window.voxelize(
            mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind),
            mesh.getIndices(),
            scale, currentColor);

        builder.loadData(data, false, false);
        memory.clear();
        symmetry.resetAxis();
        camera.frame();
    }

    this.voxelize2D = function(imgData) {
        engine.displayLoadingUI();
        const ratio = parseFloat(document.getElementById('input-voxelizer-ratio').value);
        const zUp = parseBool(document.getElementById('input-voxelizer-zup').checked);
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

            builder.loadData(data, false, true);
            memory.clear();
            symmetry.resetAxis();
            camera.frame();
            engine.hideLoadingUI();
        }
    }

    this.importMeshOBJ = function(url) {
        engine.displayLoadingUI();
        BABYLON.SceneLoader.LoadAssetContainerAsync(url, "", scene, null, '.obj')
            .then((container) => {
                const mesh = BABYLON.Mesh.MergeMeshes(container.meshes, true, true);
                container.removeAllFromScene();
                voxelizer.voxelize(mesh);
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
                    voxelizer.voxelize(mesh);
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

    this.loadUrl = function(url) {
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

    this.loadUrlImage = function(url) {
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
    this.createBox = function(isPlane = false) {
        const isFill = document.getElementById('input-grid-fill').checked;
        const X = (parseInt(document.getElementById('input-grid-x').value) - 1) / 2;
        let Y = (parseInt(document.getElementById('input-grid-y').value) - 1) / 2;
        const Z = (parseInt(document.getElementById('input-grid-z').value) - 1) / 2;
        if (isPlane) Y = 0;
        const data = [];
        if (isFill) {
            for (let x = -X; x <= X; x++) {
                for (let y = 0; y <= Y * 2; y++) {
                    for (let z = -Z; z <= Z; z++) {
                        data.push({
                            position: new BABYLON.Vector3(x, y, z),
                            color: currentColor,
                            visible: true
                        });
                    }
                }
            }
        } else {
            for (let x = -X; x <= X; x++) {
                for (let y = 0; y <= Y * 2; y++) {
                    for (let z = -Z; z <= Z; z++) {
                        if ((x <= -X || y <= 0 || z <= -Z) ||
                            (x >= X || y >= Y * 2 || z >= Z)) {
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
        if (data.length > MAXAMOUNT)
            ui.notification('warning: exceed 64k voxels', 5000);
        builder.loadData(data, false, false);
        memory.clear();
        symmetry.resetAxis();
        camera.frame();
    }

    this.createIsometric = function() {
        const size = (parseInt(document.getElementById('input-isometric-size').value) - 1) / 2;
        const data = [];
        for (let x = -size; x <= size; x++) {
            for (let y = 0; y <= size * 2; y++) {
                for (let z = -size; z <= size; z++) {
                    if (x <= -size || y <= 0 || z <= -size)
                        data.push({
                            position: new BABYLON.Vector3(x, y, z),
                            color: currentColor,
                            visible: true
                        });
                }
            }
        }
        builder.loadData(data, false, false);
        memory.clear();
        symmetry.resetAxis();
        camera.frame();
    }

    this.createTerrain = function() {
        const isHeightGrad = document.getElementById('input-terrain-grad').checked;
        const X = parseInt(document.getElementById('input-terrain-x').value) / 2;
        const Y = parseInt(document.getElementById('input-terrain-y').value);
        const Z = parseInt(document.getElementById('input-terrain-z').value) / 2;
        const perlin = new ClassicalNoise();
        const data = [];
        const colArrayHigh = gradientHexArray('#C07D21', '#31A531', Y);
        const colArrayLow  = gradientHexArray('#0000EE', '#31A531', Y);
        let xoff = 0;
        let zoff = 0;
        let v = 0;
        for (let x = -X; x < X; x++) {
            for (let z = -Z; z < Z; z++) {
                xoff = (0.4/Y) * x; // fill x and z
                zoff = (0.4/Y) * z; // relative to Y
                v = ~~(perlin.noise(xoff, 0, zoff) * Y);
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
        if (data.length > MAXAMOUNT)
            ui.notification('warning: exceed 64k voxels', 5000);
        builder.loadData(data, false, true);
        memory.clear();
        symmetry.resetAxis();
        camera.frame();
    }

    this.createSphere = function() { // source: Babylon.js createSphere()
        const X = (parseInt(document.getElementById('input-grid-x').value) - 1) / 2;
        const Y = (parseInt(document.getElementById('input-grid-y').value) - 1) / 2;
        const Z = (parseInt(document.getElementById('input-grid-z').value) - 1) / 2;
        const totalZRotSteps = 2 + ((X+Y+Z) * 2); // pseudo relativity
        const totalYRotSteps = 2 * totalZRotSteps;
        const data = [];
        for (let z = 0; z <= totalZRotSteps; z++) {
            const normalizedZ = z / totalZRotSteps;
            const angleZ = normalizedZ * Math.PI;
            for (let y = 0; y <= totalYRotSteps; y++) {
                const afterRotZ = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.Up(), BABYLON.Matrix.RotationZ(-angleZ));
                const complete = BABYLON.Vector3.TransformCoordinates(afterRotZ, BABYLON.Matrix.RotationY((y / totalYRotSteps) * PI2));
                data.push({
                    position: complete.multiplyByFloats(X, Y, Z).floor(),
                    color: currentColor,
                    visible: true
                });
            }
        }
        if (data.length > MAXAMOUNT)
            ui.notification('warning: exceed 64k voxels', 5000);
        builder.loadData(data, true, true);
        memory.clear();
        symmetry.resetAxis();
        camera.frame();
    }

    this.createRandom = function() {
        const X = (parseInt(document.getElementById('input-grid-x').value) - 1) / 2;
        const Y = (parseInt(document.getElementById('input-grid-y').value) - 1) / 2;
        const Z = (parseInt(document.getElementById('input-grid-z').value) - 1) / 2;
        const data = [];
        const colors = [];
        for (let i = 0; i < 10; i++)
            colors.push(randomHexColor());
        for (let x = -X; x <= X; x++) {
            for (let y = 0; y <= Y * 2; y++) {
                for (let z = -Z; z <= Z; z++) {
                    if (Math.random() < 0.05) {
                        data.push({
                            position: new BABYLON.Vector3(x, y, z),
                            color: colors[Math.floor(Math.random() * colors.length)],
                            visible: true
                        });
                    }
                }
            }
        }
        if (data.length > MAXAMOUNT)
            ui.notification('warning: exceed 64k voxels', 5000);
        builder.loadData(data, false, false);
        memory.clear();
        symmetry.resetAxis();
        camera.frame();
    }

    this.createFloor = function() {
        const X = (parseInt(document.getElementById('input-grid-x').value) - 1) / 2;
        const Z = (parseInt(document.getElementById('input-grid-z').value) - 1) / 2;

        for (let i = 0; i < builder.voxels.length; i++)
            builder.voxels[i].position.y += 1;
        
        for (let x = -X; x <= X; x++) {
            for (let z = -Z; z <= Z; z++) {
                builder.addNoDup(new BABYLON.Vector3(x, 0, z), currentColor, true);
            }
        }

        builder.createSPS();
        memory.record();
    }
}


// -------------------------------------------------------
// Bakery


function Bakery(scene) {
    this.meshes = [];
    this.selected = null;
    this.pick = null;
    this.lastSelected = null;
    const lastSelectedMaterial = {};

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
    
    this.bakeToMesh = function(isTestColor, voxels = builder.voxels) {
        const baked = this.reconstructSPS('_bake', isTestColor, voxels);
        resetPivot(baked);

        baked.material = material.mat_pbr.clone('_bake');

        baked.checkCollisions = true;
        baked.receiveShadows = true;
        light.addMesh(baked);

        this.meshes.push(baked);
        this.createBakeList();
    }

    this.newBake = function(voxels = null) {
        engine.displayLoadingUI();
        setTimeout(() => {
            if (MODE !== 1) ui.setMode(1);
            material.setPBRTexture();

            (voxels) ? this.bakeToMesh(true, voxels) : this.bakeToMesh(true);

            uix.bindTransformGizmo(this.meshes[this.meshes.length-1]);
            uix.gizmo.attachToMesh(this.meshes[this.meshes.length-1]);

            camera.frame();
            light.updateShadowMap();
            engine.hideLoadingUI();
        }, 100);
    }

    this.bakeColor = function(hex) {
        engine.displayLoadingUI();
        setTimeout(() => {
            if (MODE !== 1) ui.setMode(1);
            material.setPBRTexture();

            const voxels = [];
            for (let i = 0; i < builder.voxels.length; i++) {
                if (builder.voxels[i].color == hex)
                    voxels.push(builder.voxels[i]);
            }
            this.bakeToMesh(true, voxels);

            uix.bindTransformGizmo(this.meshes[this.meshes.length-1]);
            uix.gizmo.attachToMesh(this.meshes[this.meshes.length-1]);

            camera.frame();
            light.updateShadowMap();
            engine.hideLoadingUI();
        }, 100);
    }

    this.bakeAll = async function() {
        if (!await ui.showConfirm('clear and bake all voxels?')) return;
        engine.displayLoadingUI();
        setTimeout(() => {
            if (MODE !== 1) ui.setMode(1);
            material.setPBRTexture();
            this.clearBakes();

            this.bakeToMesh(true);

            camera.frame();
            light.updateShadowMap();
            engine.hideLoadingUI();
        }, 100);
    }

    this.bakeAllColors = async function() {
        if (!await ui.showConfirm('clear and bake all voxels<br>grouped by colors?')) return;
        engine.displayLoadingUI();
        setTimeout(() => {
            if (MODE !== 1) ui.setMode(1);
            material.setPBRTexture();
            this.clearBakes();

            for (let i = 0; i < palette.uniqueColors.length; i++)
                this.bakeToMesh(true, builder.getVoxelsByColor(palette.uniqueColors[i]));

            camera.frame();
            light.updateShadowMap();
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
            this.highlightMesh(clone);

            this.meshes.push(clone);
            this.createBakeList();
            this.bakeListSelect(clone);
        } else {
            ui.notification('select a bake');
        }
    }

    this.mergeSelected = function(bakes) {
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
        
        bakery.meshes.push(mesh);
        bakery.createBakeList();
    }

    this.deleteSelected = function() {
        if (this.selected) {
            this.meshes.splice(this.meshes.indexOf(this.selected), 1);
            if (this.selected.material.albedoTexture)
                this.selected.material.albedoTexture.dispose();
            this.selected.material.dispose();
            this.selected.dispose();
            this.selected = null;
            this.createBakeList();
            uix.unbindTransformGizmo();
            light.updateShadowMap();
        } else {
            ui.notification('select a bake');
        }
    }

    this.highlightMesh = function(mesh) {
        mesh.renderOverlay = true;
        mesh.overlayAlpha = 0.3;
        mesh.overlayColor = BABYLON.Color3.FromHexString(COL_ORANGE);
    }

    this.selectMesh = function(mesh) {
        this.selected = mesh;
        this.selected.renderOutline = true;
        this.selected.outlineWidth = scene.activeCamera.radius/600;
        this.selected.outlineColor = BABYLON.Color3.FromHexString(COL_ORANGE);
        this.lastSelected = mesh;
        this.bakeListSelect(mesh);
    }

    this.deselectMesh = function() {
        if (this.selected)
            this.selected = null;
        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].renderOutline = false;
            this.meshes[i].renderOverlay = false;
        }
        this.bakeListDeselect();
    }

    this.setBakesVisibility = function(isVisible) {
        for (let i = 0; i < this.meshes.length; i++)
            this.meshes[i].isVisible = isVisible;
    }

    this.clearBakes = async function(isAlert = false) {
        if (this.meshes.length > 0) {
            if (isAlert && !await ui.showConfirm('clear all baked meshes?')) return;
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
            this.selected = null;
            this.createBakeList();
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
            ui.notification('select a bake');
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

    this.storeMaterial = function(elem) {
        if (this.selected) {
            lastSelectedMaterial["roughness"] = this.selected.material.roughness;
            lastSelectedMaterial["metallic"] = this.selected.material.metallic;
            lastSelectedMaterial["alpha"] = this.selected.material.alpha;
            lastSelectedMaterial["albedoColor"] = this.selected.material.albedoColor;
            lastSelectedMaterial["emissiveColor"] = this.selected.material.emissiveColor;
            const name = elem.innerHTML;
            elem.innerHTML = 'Stored';
            setTimeout(() => {
                elem.innerHTML = name;
            }, 300);
        } else {
            ui.notification('select a bake');
        }
    }

    this.applyMaterial = function() {
        if (Object.keys(lastSelectedMaterial).length == 0) {
            ui.notification('material not stored');
            return;
        }
        if (this.selected) {
            currentColorBake = lastSelectedMaterial["albedoColor"].toHexString();
            ui.domRoughness.value = lastSelectedMaterial["roughness"];
            ui.domRoughnessRange.value = lastSelectedMaterial["roughness"];
            ui.domMetallic.value = lastSelectedMaterial["metallic"];
            ui.domMetallicRange.value = lastSelectedMaterial["metallic"];
            ui.domAlpha.value = lastSelectedMaterial["alpha"];
            ui.domAlphaRange.value = lastSelectedMaterial["alpha"];
            ui.domColorPickerAlbedo.value = lastSelectedMaterial["albedoColor"].toHexString();
            ui.domColorPickerEmissive.value = lastSelectedMaterial["emissiveColor"].toHexString();
            this.setMaterial('roughness');
            this.setMaterial('metallic');
            this.setMaterial('alpha');
            this.setMaterial('albedo');
            this.setMaterial('emissive');
        } else {
            ui.notification('select a bake');
        }
    }

    this.replaceTexture = function() {
        if (this.selected && this.selected.material) {
            if (this.selected.material.albedoTexture)
                this.selected.material.albedoTexture.dispose();
            this.selected.material.albedoTexture = material.textures[material.texId].clone();
        }
    }

    this.replaceTextureAll = async function() {
        if (!await ui.showConfirm('apply texture to all baked meshes?')) return;
        for (let i = 0; i < bakery.meshes.length; i++) {
            this.selected = bakery.meshes[i];
            this.replaceTexture();
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
            const rgb = hexToRgbFloat(hex);
            for (let i = 0; i < this.selected.getVerticesData(BABYLON.VertexBuffer.PositionKind).length/3; i++) {
                colors.push(rgb.r, rgb.g, rgb.b, 1);
            }
            this.selected.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
        } else {
            ui.notification('select a bake');
        }
    }

    this.createBakeList = function() {
        ui.domBakeList.innerHTML = "";
        for (let i = 0; i < bakery.meshes.length; i++) {
            const item = document.createElement('div');
            const btn = document.createElement('button');
            btn.innerHTML = bakery.meshes[i].name;
            btn.spellcheck = false;
            btn.onclick = () => {
                bakery.deselectMesh();
                bakery.selectMesh(bakery.meshes[i]);
                uix.bindTransformGizmo(this.meshes[i]);
                uix.gizmo.attachToMesh(this.meshes[i]);
            };
            btn.onkeyup = () => {
                bakery.meshes[i].name = btn.innerHTML;
            };
            btn.onpaste = (ev) => {
                ev.preventDefault();
                btn.innerHTML = ev.clipboardData.getData('Text');
                bakery.meshes[i].name = btn.innerHTML;
            };
            btn.ondblclick = () => {
                btn.contentEditable = true;
                btn.classList.add('ignorekeys');
            };
            btn.onblur = () => {
                btn.contentEditable = false;
                btn.classList.remove('ignorekeys');
            };
            item.appendChild(btn);
            ui.domBakeList.appendChild(item);
        }
    }

    this.bakeListSelect = function(mesh) {
        let idx = -1;
        for (let i = 0; i < bakery.meshes.length; i++)
            if (bakery.meshes[i] === mesh)
                idx = i;
        
        if (ui.domBakeList.children[idx]) {
            for (const i of ui.domBakeList.children)
                i.firstChild.classList.remove("bakery_select");
            ui.domBakeList.children[idx].firstChild.classList.add('bakery_select');
        }
    }

    this.bakeListDeselect = function() {
        for (const i of ui.domBakeList.children)
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
                        bakery.normalizeMeshGLTF(baked, container.meshes[i].material.clone(container.meshes[i].name));
                        bakery.meshes.push(baked);
                        count += 1;
                    }
                }
                container.removeAllFromScene();

                if (count == 0) {
                    ui.notification('unable to load baked meshes');
                } else {
                    if (!isInsideBakery)
                        (isLoadBakery) ? ui.setMode(1) : ui.setMode(0);
                    bakery.updateReflectionTextures();
                    bakery.createBakeList();
                    light.updateShadowMap();
                }
                engine.hideLoadingUI();
            }).catch((reason) => {
                engine.hideLoadingUI();
                ui.notification("unable to load bake");
                console.error(reason.message);
            });
    }

    // normalize GLTF mesh for bakery
    this.normalizeMeshGLTF = function(mesh, material) {
        mesh.setParent(null);
        mesh.metadata = null;

        // important, GLTF exporter flip side-orientation,
        mesh.overrideMaterialSideOrientation = null;
        mesh.flipFaces(false); // or can't merge them to new bakes

        mesh.material = material;
        mesh.visibility = mesh.material.alpha; // reload alpha seth!
        
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        light.addMesh(mesh);
    }

    const facePositions = [
        new BABYLON.Vector3(0.5, 0, 0),
        new BABYLON.Vector3(-0.5, 0, 0),
        new BABYLON.Vector3(0, 0.5, 0),
        new BABYLON.Vector3(0, -0.5, 0),
        new BABYLON.Vector3(0, 0, 0.5),
        new BABYLON.Vector3(0, 0, -0.5)
    ];
    const nearPositions = [
        new BABYLON.Vector3(1, 0, 0),
        new BABYLON.Vector3(-1, 0, 0),
        new BABYLON.Vector3(0, 1, 0),
        new BABYLON.Vector3(0, -1, 0),
        new BABYLON.Vector3(0, 0, 1),
        new BABYLON.Vector3(0, 0, -1)
    ];
    const indices = [ 0, 1, 2, 0, 2, 3 ];
    const positions = [ -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5,  0.5, 0, -0.5,  0.5, 0 ];
    const normals = [ 0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0, 0, 0, -1.0 ];
    this.reconstructSPS = function(name, isTestColor, voxels) {
        const planes = [];

        function constructPlane(side, isPerFaceUV) {
            const uvs = [];
            if (isPerFaceUV) {
                uvs.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
            } else {
                if (side == 'right')       uvs.push(1,1/3, 0,1/3,  0,2/3, 1,2/3);
                else if (side == 'left')   uvs.push(1,1/3, 0,1/3,  0,2/3, 1,2/3);
                else if (side == 'top')    uvs.push(0,1,   1,1,    1,2/3, 0,2/3);
                else if (side == 'bottom') uvs.push(0,1/3, 1,1/3,  1,0,   0,0);
                else if (side == 'front')  uvs.push(1,1/3, 0,1/3,  0,2/3, 1,2/3);
                else if (side == 'back')   uvs.push(1,1/3, 0,1/3,  0,2/3, 1,2/3);
            }
    
            BABYLON.VertexData._ComputeSides(BABYLON.VertexData.FRONTSIDE,
                positions, indices, normals, uvs);
    
            const mesh = new BABYLON.Mesh('plane', scene);
            const vertexData = new BABYLON.VertexData();
            vertexData.positions = positions;
            vertexData.normals = normals;
            vertexData.uvs = uvs;
            vertexData.indices = indices;
            vertexData.applyToMesh(mesh);
            return mesh;
        }

        function constructFace(index, side, position, nearby, rotX, rotY, colors) {
            const idx = builder.findIndexByPosition(voxels[index].position.add(nearby));
            if (idx == -1) { // test by side
                const plane = constructPlane(side, ui.domBakeryPerFaceUvs.checked);
                plane.position = voxels[index].position.add(position);
                plane.rotation.x = rotX;
                plane.rotation.y = rotY;
                plane.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
                planes.push(plane);
            } else { // test by color
                if (isTestColor) {
                    if (voxels[index].color !== builder.voxels[idx].color) {
                        const plane = constructPlane(side, ui.domBakeryPerFaceUvs.checked);
                        plane.position = voxels[index].position.add(position);
                        plane.rotation.x = rotX;
                        plane.rotation.y = rotY;
                        plane.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
                        planes.push(plane);
                    }
                }
            }
        }

        for (let i = 0; i < voxels.length; i++) {
            const rgb = hexToRgbFloat(voxels[i].color);
            const colors = [rgb.r, rgb.g, rgb.b, 1, // 24 verts / 3 = 8
                            rgb.r, rgb.g, rgb.b, 1,
                            rgb.r, rgb.g, rgb.b, 1,
                            rgb.r, rgb.g, rgb.b, 1,
                            rgb.r, rgb.g, rgb.b, 1,
                            rgb.r, rgb.g, rgb.b, 1,
                            rgb.r, rgb.g, rgb.b, 1,
                            rgb.r, rgb.g, rgb.b, 1];

            constructFace(i, 'right',  // X+
                    facePositions[0],
                    nearPositions[0],
                    0, -PIH, colors);
            constructFace(i, 'left',   // X-
                    facePositions[1],
                    nearPositions[1],
                    0, PIH, colors);
            constructFace(i, 'top',    // Y+
                    facePositions[2],
                    nearPositions[2],
                    PIH, 0, colors);
            constructFace(i, 'bottom', // Y-
                    facePositions[3],
                    nearPositions[3],
                    -PIH, 0, colors);
            constructFace(i, 'front',  // Z+
                    facePositions[4],
                    nearPositions[4],
                    0, Math.PI, colors);
            constructFace(i, 'back',   // Z-
                    facePositions[5],
                    nearPositions[5],
                    0, 0, colors);
        }

        const mesh = BABYLON.Mesh.MergeMeshes(planes, true, true);
        mesh.name = name;
        return mesh;
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
        memory.clear();
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

    this.record = function() {
        this.stack[++this.block] = builder.getData();
        this.stack.splice(this.block + 1); // delete anything forward
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

    this.clear = function() {
        this.stack = [];
        this.block = -1;
        this.record(); // init memory block 0
    }
}


// -------------------------------------------------------
// Project


function Project(scene) {
    const json = {
        version: "Voxel Builder 4.1.3",
        project: {
            name: "name",
            bgcolor: "#FFFFFF",
            lightcolor: "#FFFFFF"
        },
        data: {
            voxels: "",
            bakes: ""
        }
    };

    function fillJsonData(voxels, bakes) {
        json.project.name = ui.domProjectName.value;
        json.project.bgcolor = ui.domColorPickerBackground.value.toUpperCase();
        json.project.lightcolor = ui.domColorPickerLightColor.value.toUpperCase();
        json.data.voxels = voxels;
        json.data.bakes = bakes;
    }

    this.init = function() {
        builder.loadData([{ // fill null data
            position: BABYLON.Vector3.Zero(),
            color: currentColor,
            visible: false
        }], false, false);
    }

    this.newBox = function(size = 4, hex = currentColor) {
        size = (size - 1) / 2;
        const data = [];
        for (let x = -size; x <= size; x++) {
            for (let y = 0; y <= size*2; y++) {
                for (let z = -size; z <= size; z++) {
                    data.push({
                        position: new BABYLON.Vector3(x, y, z),
                        color: hex,
                        visible: true
                    });
                }
            }
        }
        builder.loadData(data, false, false);
        memory.clear();
        symmetry.resetAxis();
        bakery.clearBakes();
        ui.setMode(0);
        camera.frame();
        palette.create(); // important
        ui.domProjectName.value = 'untitled';
    }

    this.save = function() {
        let data = '';
        for (let i = 0; i < builder.voxels.length; i++) {
            data += builder.voxels[i].position.x + ',' +
                    builder.voxels[i].position.y + ',' +
                    builder.voxels[i].position.z + ',' +
                    builder.voxels[i].color + ',' +
                    builder.voxels[i].visible + ';';
        }

        fillJsonData(data, "");

        if (bakery.meshes.length > 0) {
            BABYLON.GLTF2Export.GLBAsync(scene, ui.domProjectName.value, bakery.exportOptions).then((glb) => {
                const blob = glb.glTFFiles[ui.domProjectName.value + ".glb"];
                const file = new File([ blob ], "exported.glb");
                const reader = new FileReader();
                reader.onload = () => {
                    json.data.bakes = reader.result;
                    saveDialog(JSON.stringify(json), ui.domProjectName.value + '.vbx');
                    data = null;
                }
                reader.readAsDataURL(file);
            });
        } else {
            saveDialog(JSON.stringify(json), ui.domProjectName.value + '.vbx');
            data = null;
        }
    }

    this.load = function(data) {
        if (data.startsWith('#')) {
            loadTXT(data); // backward compatibity < 3.8.9
            return;
        }

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
        if (data.project.bgcolor) {
            setProjectValues(ui.domColorPickerBackground, data.project.bgcolor, '#6C6F7A');
        }
        if (data.project.lightcolor) {
            setProjectValues(ui.domColorPickerLightColor, data.project.lightcolor, '#CCCCCC');
            light.updateColor(ui.domColorPickerLightColor.value);
        }

        // data.voxels
        const voxels = data.data.voxels.split(';').slice(0, -1);
        const voxdata = [];
        for (let i = 0; i < voxels.length; i++) {
            const chunk = voxels[i].split(',');
            voxdata.push({
                position: new BABYLON.Vector3(
                    parseFloat(chunk[0]),
                    parseFloat(chunk[1]),
                    parseFloat(chunk[2])
                ),
                color: chunk[3].toUpperCase(),
                visible: parseBool(chunk[4])
            });
        }
        ui.setMode(0);
        builder.loadData(voxdata, false, false);
        memory.clear();
        symmetry.resetAxis();
        camera.frame();

        // data.bakes
        if (data.data.bakes) {
            bakery.clearBakes(false);
            bakery.loadBakes(data.data.bakes, false);
        } else {
            bakery.clearBakes(false);
        }
    }

    function loadTXT(voxdata) { // < 3.8.9
        ui.setMode(0);
        const lines = voxdata.split('\n');
        const data = [];
        let chunk = [];
        let line = '';
        ui.domProjectName.value = 'untitled';
        for (let i = 0; i < lines.length; i++) {
            if (lines[i]) { // ignore empty lines
                line = lines[i].replace(/\s+/g, ''); // strip whitespaces
                if (line.startsWith('#')) {
                    ui.domProjectName.value = line.substring(1); // strip #
                } else if (line.startsWith('data:')) {
                    bakery.clearBakes();
                    bakery.loadBakes(line, false);
                } else {
                    chunk = line.split(',');
                    data.push({ 
                        position: new BABYLON.Vector3(
                            parseFloat(chunk[0]),
                            parseFloat(chunk[1]),
                            parseFloat(chunk[2])),
                        color: chunk[3],
                        visible: parseBool(chunk[4])
                    });
                }
            }
        }
        if (!lines[lines.length - 1].startsWith('data:'))
            bakery.clearBakes(false); // no bakes, just clear bakery
        builder.loadData(data, false, false);
        memory.clear();
        symmetry.resetAxis();
        camera.frame();
        chunk = null;
    }

    this.importBakes = function(data) {
        try {
            data = JSON.parse(data);
            if (data.data.bakes) {
                bakery.loadBakes(data.data.bakes, true);
                camera.frame();
                return;
            }
        } catch(err) {
            if (data.startsWith(';')) {
                data = parseINI(data);
                if (data.data.bakes) { // backward compatibity < 4.0.3
                    bakery.loadBakes(data.data.bakes, true);
                    camera.frame();
                    return;
                }
            }
        }
        ui.notification('unable to read baked data');
    }

    this.exportVoxels = function() {
        const options = {
            shouldExportNode: (node) => {
                return node == builder.SPS.mesh;
            }
        }
        engine.displayLoadingUI();
        builder.SPS.mesh.material = material.createExportMaterial();
        
        switch (ui.domExportFormat.value) {
            case 'glb':
                BABYLON.GLTF2Export.GLBAsync(scene, ui.domProjectName.value, options).then((glb) => {
                    glb.downloadFiles();
                    builder.SPS.mesh.material.dispose();
                    builder.SPS.mesh.material = material.mat_cel;
                    engine.hideLoadingUI();
                });
                break;
            case 'gltf':
                BABYLON.GLTF2Export.GLTFAsync(scene, ui.domProjectName.value, options).then((gltf) => {
                    gltf.downloadFiles();
                    builder.SPS.mesh.material.dispose();
                    builder.SPS.mesh.material = material.mat_cel;
                    engine.hideLoadingUI();
                });
                break;
            case 'obj':
                downloadBlob(new Blob([ 
                    BABYLON.OBJExport.OBJ([ builder.SPS.mesh ], false, 'material', true)
                ], { type: "octet/stream" }), ui.domProjectName.value + '.obj');
                builder.SPS.mesh.material.dispose();
                builder.SPS.mesh.material = material.mat_cel;
                break;
            case 'stl':
                const mesh = builder.SPS.mesh.clone();
                //const node = new BABYLON.TransformNode();
                //mesh.setParent(node);
                //node.rotation.x = Math.PI / 2;
                //node.scaling.z = -1;
                BABYLON.STLExport.CreateSTL([ mesh ], true, ui.domProjectName.value, false, false, false);
                mesh.dispose();
                //node.dispose();
                builder.SPS.mesh.material.dispose();
                builder.SPS.mesh.material = material.mat_cel;
                //builder.createSPS();
                break;
        }

        engine.hideLoadingUI();
    }

    this.exportBakes = function() {
        if (bakery.meshes.length == 0) {
            ui.notification('no baked meshes');
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
                //const mesh = BABYLON.Mesh.MergeMeshes(bakery.meshes, false, true);
                //const node = new BABYLON.TransformNode();
                //mesh.setParent(node);
                //node.rotation.x = Math.PI / 2;
                //node.scaling.z = -1;
                BABYLON.STLExport.CreateSTL(exports, true, ui.domProjectName.value, false, false, false);
                //mesh.dispose();
                //node.dispose();
                break;
        }
        engine.hideLoadingUI();
    }

    this.loadFromUrl = function(url) {
        if (url == '') return; // ignore first preset option
        fetch(url).then((response) => {
            if (response.status !== 200) {
                ui.notification('unable to load data from url');
                return;
            }
            response.text().then((data) => {
                project.load(data);
            });
        }).catch((err) => {
            console.error('loadUrl', err);
        });
    }

    this.loadMagicaVoxel = function(buffer) {
        engine.displayLoadingUI();
        setTimeout(() => {
            const chunks = parseMagicaVoxel(buffer);
            if (!chunks) {
                ui.notification('unable to load magicavoxel file');
                return;
            }
            if (chunks[0].data.length / 4 > MAXAMOUNT)
                ui.notification('warning: exceed 64k voxels', 5000);

            const data = [];
            for (let i = 0; i < chunks[0].data.length; i += 4) {
                const x = chunks[0].data[ i + 0 ];
                const y = chunks[0].data[ i + 1 ];
                const z = chunks[0].data[ i + 2 ];
                const c = chunks[0].data[ i + 3 ];

                const hex = chunks[0].palette[ c ];
                const r = ( hex >> 0 & 0xff ) / 0xff;
                const g = ( hex >> 8 & 0xff ) / 0xff;
                const b = ( hex >> 16 & 0xff ) / 0xff;

                data.push({ 
                    position: new BABYLON.Vector3(x, z, -y),
                    color: rgbFloatToHex(r, g, b),
                    visible: true
                });
            }

            ui.setMode(0);
            builder.loadData(data, false, true);
            memory.clear();
            symmetry.resetAxis();
            bakery.clearBakes(false);
            camera.frame();
            engine.hideLoadingUI();
        }, 100);
    }

    function setProjectValues(uiDom, iniKey, defVal) {
        (iniKey) ? uiDom.value = iniKey : uiDom.value = defVal;
    }

    this.init();
}


// -------------------------------------------------------
// UserInterface


function UserInterface(scene) {
    this.currentRenderMode = 'voxel'; // voxel|bake
    this.isShowMenuFile = false;
    this.isShowMenuGenerator = false;
    this.isShowMenuVoxelizer = false;
    this.isShowMenuSymmetry = false;
    this.isShowMenuModel = false;
    this.isShowMenuPaint = false;
    this.isShowMenuVoxels = false;
    this.isShowMenuBakery = false;
    this.isShowMenuMeshes = false;
    this.isShowMenuPathtracer = false;
    this.isShowMenuCamera = false;
    this.isShowMenuEnv = false;
    this.isShowMenuMaterial = false;
    this.isShowMenuTexture = false;
    this.isShowMenuRender = false;
    this.isShowMenuStorage = false;
    this.isShowMenuGroups = false;
    this.isShowMenuPrefs = false;
    this.isShowMenuAbout = false;
    this.domToolbarR = document.getElementById('toolbar_R');
    this.domToolbarL = document.getElementById('toolbar_L');
    this.domToolbarC = document.getElementById('toolbar_C');
    this.domToolbarC_mem = document.getElementById('toolbar_C_mem');
    this.domModes = document.querySelectorAll('#toolbar_C li.mode');
    this.domMenuR = document.getElementsByClassName('menu_R');
    this.domMenuL = document.getElementsByClassName('menu_L');
    this.domMenuFile = document.getElementById('menu-file');
    this.domMenuGenerator = document.getElementById('menu-generator');
    this.domMenuVoxelizer = document.getElementById('menu-voxelizer');
    this.domMenuSymmetry = document.getElementById('menu-symmetry');
    this.domMenuModel = document.getElementById('menu-model');
    this.domMenuPaint = document.getElementById('menu-paint');
    this.domMenuVoxels = document.getElementById('menu-voxels');
    this.domMenuBakery = document.getElementById('menu-bakery');
    this.domMenuMeshes = document.getElementById('menu-meshes');
    this.domMenuPathtracer = document.getElementById('menu-pathtracer');
    this.domMenuCamera = document.getElementById('menu-camera');
    this.domMenuEnv = document.getElementById('menu-env');
    this.domMenuMaterial = document.getElementById('menu-material');
    this.domMenuTexture = document.getElementById('menu-texture');
    this.domMenuRender = document.getElementById('menu-render');
    this.domMenuStorage = document.getElementById('menu-storage');
    this.domMenuGroups = document.getElementById('menu-groups');
    this.domMenuPrefs = document.getElementById('menu-prefs');
    this.domMenuAbout = document.getElementById('menu-about');
    this.domMenuInScreen = document.getElementById('menu_inscreen');
    this.domSymmAxis = document.getElementById('btn-symm-axis');
    this.domSymmAxis2 = document.getElementById('btn-helper-symmetry');
    this.domSymmCenter = document.getElementById('input-symm-center');
    this.domWorkplaneBtn = document.getElementById('btn-helper-workplane');
    this.domColorBucketBtn = document.getElementById('colorbucket');
    this.domPalette = document.getElementById('palette');
    this.domPaletteColors = document.getElementById('palette-colors');
    this.domBakeList = document.getElementById('bakelist');
    this.domHover = document.getElementById('hover');
    this.domMarquee = document.getElementById("marquee");
    this.domBoxToolHeight = document.getElementById('input-boxtool-height');
    this.domPipelineContrast = document.getElementById('input-pipeline-contrast');
    this.domPipelineExposure = document.getElementById('input-pipeline-exposure');
    this.domPipelineHue = document.getElementById('input-pipeline-hue');
    this.domPipelineBloom = document.getElementById('input-pipeline-bloom');
    this.domPipelineDof = document.getElementById('input-pipeline-dof');
    this.domPipelineDofDist = document.getElementById('input-pipeline-dofdist');
    this.domPipelineSharpen = document.getElementById('input-pipeline-sharpen');
    this.domPipelineGrain = document.getElementById('input-pipeline-grain');
    this.domPipelineVignette = document.getElementById('input-pipeline-vignette');
    this.domPipelineChromatic = document.getElementById('input-pipeline-chromatic');
    this.domHdriToggle = document.getElementById('input-hdri-toggle');
    this.domHdriBlur = document.getElementById('input-hdri-blur');
    this.domCameraFov = document.getElementById('input-camera-fov');
    this.domCameraAperture = document.getElementById('input-camera-aperture');
    this.domCameraFocalLength = document.getElementById('input-camera-focal');
    this.domBakeryPerFaceUvs = document.getElementById('input-bakery-uvs');
    this.domBakeryBackFace = document.getElementById('input-bakery-backface');
    this.domAutoRotation = document.getElementById('input-autorotate');
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
    this.domProjectName = document.getElementById('input-project-name');
    this.domExportFormat = document.getElementById('input-export-format');
    this.domExportSelectedBake = document.getElementById('input-export-selbake');
    this.domAxisViewHitbox = document.getElementById('axisview-hitbox');
    this.domOrthoBtn = document.getElementById('btn-ortho');
    this.domSandboxControls = document.getElementById('sandbox_controls');
    this.domReticle = document.getElementById('reticle');
    this.domConfirm = document.getElementById('confirm');
    this.domConfirmBlocker = document.getElementById('confirmblocker');
    this.domNotifier = document.getElementById('notifier');
    this.domInfoWebsocket = document.getElementById('info_ws');
    this.domInfo = document.getElementById('info').children;
    this.domInfoParent = document.getElementById('info');
    this.domProgressBar = document.getElementById('progressbar');
    this.domLoadingScreen = document.getElementById('loadingscreen');
    this.domPathtracerBtn = document.getElementById('btn-pt-render');
    const styleMenuR = 'translate(200px, 0)';
    const styleMenuL = 'translate(-200px, 0)';
    const styleMenuR_open = 'translate(-65px, 0)';
    const styleMenuL_open = 'translate(65px, 0)';
    const hoverOffset = { x: 0, y: 0 };
    let notificationTimer = null;

    this.init = function() {
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
                ui.notification('select a bake');
        }, false);

        this.domColorPickerBackground.addEventListener('input', (ev) => {
            if (MODE == 0 || MODE == 1) {
                scene.clearColor = BABYLON.Color4.FromHexString(ev.target.value);
            } else if (MODE == 2) {
                scene.clearColor = BABYLON.Color4.FromHexString(ev.target.value).toLinearSpace();
            }
            scene.autoClear = ui.domBackgroundCheck.checked;
        }, false);

        this.domColorPickerLightColor.addEventListener('input', (ev) => {
            light.updateColor(ev.target.value);
        }, false);

        this.domLightLocator.addEventListener('input', (ev) => {
            (ev.target.checked) ? uix.showSunLocator() : uix.hideSunLocator();
        }, false);

        document.getElementById('btn-light-defaultsun').onclick = () => {
            ui.domColorPickerLightColor.value = '#EDD59E';
            light.updateColor('#EDD59E');
            if (window.ptIsActive)
                window.pt.updateUniformSunCol('#EDD59E');
        };
    }

    this.setMode = function(mode) {
        MODE = mode;

        if (window.pt)
            window.pt.deactivate();

        if (mode == 0) {
            if (preferences.getWebsocket()) client.ws_connect();
            scene.collisionsEnabled = false;
            scene.clearColor = BABYLON.Color4.FromHexString(this.domColorPickerBackground.value);
            light.updateDarkness(0.6);
            tool.toolSelector('camera');
            toolBakery.toolSelector('xform');
            builder.setMeshVisibility(true);
            bakery.setBakesVisibility(false);
            pipeline.dispose();
            helper.gridPlane.isVisible = true;
            helper.groundPlane.isVisible = false;
            helper.toggleAxisPlane(symmetry.axis !== '');
            uix.showJoysticks(false);
            (uix.isWorkplane) ? uix.bindWorkplane() : uix.unbindWorkplane();
            for (let i = 0; i < viewAxes.length; i++)
                viewAxes[i].isVisible = true;
        } else if (mode == 1) {
            client.close();
            scene.collisionsEnabled = false;
            scene.clearColor = BABYLON.Color4.FromHexString(this.domColorPickerBackground.value);
            light.updateDarkness(0);
            tool.toolSelector('camera');
            toolBakery.toolSelector('xform');
            builder.setMeshVisibility(false);
            bakery.setBakesVisibility(true);
            bakery.createBakeList();
            pipeline.dispose();
            helper.gridPlane.isVisible = true;
            helper.groundPlane.isVisible = false;
            helper.toggleAxisPlane(false);
            uix.showJoysticks(false);
            uix.unbindWorkplane();
            for (let i = 0; i < viewAxes.length; i++)
                viewAxes[i].isVisible = true;
        } else if (mode == 2) {
            client.close();
            scene.collisionsEnabled = true;
            scene.clearColor = BABYLON.Color4.FromHexString(this.domColorPickerBackground.value).toLinearSpace();
            tool.toolSelector('camera');
            toolBakery.toolSelector('xform');
            pipeline.init();
            this.setRenderMode(this.currentRenderMode);
            helper.gridPlane.isVisible = false;
            helper.groundPlane.isVisible = true;
            helper.toggleAxisPlane(false);
            uix.hideSunLocator();
            uix.showJoysticks(isMobileDevice());
            uix.unbindWorkplane();
            for (let i = 0; i < viewAxes.length; i++)
                viewAxes[i].isVisible = false;
        }

        scene.autoClear = this.domBackgroundCheck.checked;
        hdri.toggleSkybox(this.domHdriToggle.checked);

        if (scene.activeCamera.useAutoRotationBehavior)
            camera.toggleCameraAutoRotation();
        camera.switchCamera();

        light.updateShadowMap();

        this.setInterfaceMode(mode);
    }

    this.setRenderMode = function(mode) {
        if (mode == 'bake' && bakery.meshes.length == 0)
            mode = 'voxel';
        this.currentRenderMode = mode;
        
        if (mode == 'voxel') {
            light.updateDarkness(0.6);
            builder.setMeshVisibility(true);
            bakery.setBakesVisibility(false);
            this.domToolbarC_mem.children[0].classList.add("btn_select");
            this.domToolbarC_mem.children[1].classList.remove("btn_select");
        } else if (mode == 'bake') {
            light.updateDarkness(0);
            builder.setMeshVisibility(false);
            bakery.setBakesVisibility(true);
            this.domToolbarC_mem.children[0].classList.remove("btn_select");
            this.domToolbarC_mem.children[1].classList.add("btn_select");
        }

        light.updateShadowMap();
    }

    this.setInterfaceMode = function(mode) {
        this.domToolbarC_mem.style.display = 'unset';
        this.domToolbarC_mem.children[0].innerHTML = 'SAVE';
        this.domToolbarC_mem.children[1].innerHTML = 'LOAD';
        this.domToolbarC_mem.children[0].style.width = '47px';
        this.domToolbarC_mem.children[1].style.width = '47px';
        this.domToolbarC_mem.children[0].classList.remove("btn_select");
        this.domToolbarC_mem.children[1].classList.remove("btn_select");
        this.domPalette.style.display = 'none';
        this.domBakeList.style.display = 'none';
        this.domHover.style.display = 'unset';
        this.domColorPicker.style.display = 'none';
        this.domSandboxControls.style.display = 'none';
        this.domReticle.style.display = 'none';
        this.domAxisViewHitbox.style.display = 'none';
        this.domWorkplaneBtn.style.display = 'none';
        this.domColorBucketBtn.style.display = 'none';
        this.domAutoRotation.disabled = false;
        this.domOrthoBtn.disabled = false;
        this.domMenuInScreen.style.display = 'none';
        this.domPathtracerBtn.disabled = false;
        this.domPathtracerBtn.previousElementSibling.disabled = false;
        uix.colorPicker.isVisible = false;
        for (const i of this.domToolbarL.children)
            i.style.display = 'unset';
        for (const i of this.domToolbarR.children)
            i.style.display = 'unset';
        document.getElementsByClassName('tool_bakecolor')[0].disabled = true;
            
        if (mode == 0) {
            this.domPalette.style.display = 'unset';
            this.domColorPicker.style.display = 'unset';
            this.domToolbarR.children[9].style.display = 'none'; // MESHES
            this.domToolbarL.children[3].style.display = 'none'; // PBR MAT
            this.domToolbarL.children[4].style.display = 'none'; // PBR TEX
            this.domToolbarL.children[5].style.display = 'none'; // PBR RENDER
            this.domToolbarC_mem.children[0].onclick = snapshot.setStorageVoxels; // SAVE
            this.domToolbarC_mem.children[1].onclick = snapshot.getStorageVoxels; // LOAD
            this.domToolbarC_mem.children[2].style.display = 'inline-block'; // UNDO
            this.domToolbarC_mem.children[3].style.display = 'inline-block'; // REDO
            this.domMenuInScreen.style.display = 'unset';
            this.domPathtracerBtn.disabled = false;
            this.domPathtracerBtn.previousElementSibling.disabled = false;
            this.domWorkplaneBtn.style.display = 'unset';
            this.domColorBucketBtn.style.display = 'unset';
            uix.colorPicker.isVisible = true;
            document.getElementsByClassName('tool_bakecolor')[0].disabled = false;
        } else if (mode == 1) {
            this.domBakeList.style.display = 'unset';
            this.domHover.style.display = 'none';
            this.domToolbarR.children[2].style.display = 'none'; // GENERATOR
            this.domToolbarR.children[3].style.display = 'none'; // VOXELIZER
            this.domToolbarR.children[4].style.display = 'none'; // SYMMETRY
            this.domToolbarR.children[5].style.display = 'none'; // MODEL
            this.domToolbarR.children[6].style.display = 'none'; // PAINT
            this.domToolbarR.children[7].style.display = 'none'; // VOXELS
            this.domToolbarL.children[5].style.display = 'none'; // PBR RENDER
            this.domToolbarL.children[6].style.display = 'none'; // STORAGE
            this.domToolbarL.children[7].style.display = 'none'; // GROUP
            this.domToolbarC_mem.children[0].onclick = snapshot.setStorageBakes; // SAVE
            this.domToolbarC_mem.children[1].onclick = snapshot.getStorageBakes; // LOAD
            this.domToolbarC_mem.children[0].style.width = '60px';
            this.domToolbarC_mem.children[1].style.width = '60px';
            this.domToolbarC_mem.children[2].style.display = 'none'; // UNDO
            this.domToolbarC_mem.children[3].style.display = 'none'; // REDO
        } else if (mode == 2) {
            this.domHover.style.display = 'none';
            this.domSandboxControls.style.display = 'unset';
            this.domReticle.style.display = 'grid';
            this.domToolbarR.children[2].style.display = 'none'; // GENERATOR
            this.domToolbarR.children[3].style.display = 'none'; // VOXELIZER
            this.domToolbarR.children[4].style.display = 'none'; // SYMMETRY
            this.domToolbarR.children[5].style.display = 'none'; // MODEL
            this.domToolbarR.children[6].style.display = 'none'; // PAINT
            this.domToolbarR.children[7].style.display = 'none'; // VOXELS
            this.domToolbarR.children[8].style.display = 'none'; // BAKERY
            this.domToolbarR.children[9].style.display = 'none'; // MESHES
            this.domToolbarL.children[3].style.display = 'none'; // PBR MAT
            this.domToolbarL.children[4].style.display = 'none'; // PBR TEX
            this.domToolbarL.children[6].style.display = 'none'; // STORAGE
            this.domToolbarL.children[7].style.display = 'none'; // GROUP
            this.domToolbarC_mem.children[0].onclick = () => { ui.setRenderMode('voxel') };
            this.domToolbarC_mem.children[1].onclick = () => { ui.setRenderMode('bake') };
            this.domToolbarC_mem.children[0].innerHTML = 'VOXELS';
            this.domToolbarC_mem.children[1].innerHTML = 'BAKES';
            this.domToolbarC_mem.children[0].style.width = '60px';
            this.domToolbarC_mem.children[1].style.width = '60px';
            this.domToolbarC_mem.children[2].style.display = 'none';  // UNDO
            this.domToolbarC_mem.children[3].style.display = 'none';  // REDO
            this.domAutoRotation.disabled = true;
            this.domOrthoBtn.disabled = true;
            this.domPathtracerBtn.disabled = true;
            this.domPathtracerBtn.previousElementSibling.disabled = true;
            this.domLightLocator.checked = false;
            (this.currentRenderMode == "voxel") ?
                this.domToolbarC_mem.children[0].classList.add("btn_select") :
                this.domToolbarC_mem.children[1].classList.add("btn_select");
            if (isMobileDevice()) // allow to frame camera (joysticks prevent access to axisview)
                this.domAxisViewHitbox.style.display = 'unset';
            if (this.isShowMenuPathtracer)
                this.toggleMenuPathtracer();
        }

        for (const i of this.domModes)
            i.classList.remove("mode_select");
        this.domModes[mode].classList.add("mode_select");

        this.clearAllMenus('both', [ // except
            this.domMenuAbout,
            this.domMenuFile,
            this.domMenuPrefs,
            this.domMenuCamera,
            this.domMenuEnv,
            this.domMenuPathtracer
        ]);

        if (scene.activeCamera.mode == BABYLON.Camera.PERSPECTIVE_CAMERA)
            this.domOrthoBtn.innerHTML = 'Perspective';
        if (scene.activeCamera.mode == BABYLON.Camera.ORTHOGRAPHIC_CAMERA)
            this.domOrthoBtn.innerHTML = 'Orthographic';

        this.domBackgroundCheck.disabled = (mode == 2) ? true : false;
    }

    this.toggleMenuAbout = function() {
        this.isShowMenuAbout = !this.isShowMenuAbout;
        this.switchMenus(this.domMenuAbout, 'right', this.isShowMenuAbout);
    }
    this.toggleMenuPrefs = function() {
        this.isShowMenuPrefs = !this.isShowMenuPrefs;
        this.switchMenus(this.domMenuPrefs, 'right', this.isShowMenuPrefs);
    }
    this.toggleMenuFile = function() {
        this.isShowMenuFile = !this.isShowMenuFile;
        this.switchMenus(this.domMenuFile, 'right', this.isShowMenuFile);
    }
    this.toggleMenuGenerator = function() {
        this.isShowMenuGenerator = !this.isShowMenuGenerator;
        this.switchMenus(this.domMenuGenerator, 'right', this.isShowMenuGenerator);
    }
    this.toggleMenuVoxelizer = function() {
        this.isShowMenuVoxelizer = !this.isShowMenuVoxelizer;
        this.switchMenus(this.domMenuVoxelizer, 'right', this.isShowMenuVoxelizer);
    }
    this.toggleMenuSymmetry = function() {
        this.isShowMenuSymmetry = !this.isShowMenuSymmetry;
        this.switchMenus(this.domMenuSymmetry, 'right', this.isShowMenuSymmetry);
    }
    this.toggleMenuModel = function() {
        this.isShowMenuModel = !this.isShowMenuModel;
        this.switchMenus(this.domMenuModel, 'right', this.isShowMenuModel);
    }
    this.toggleMenuPaint = function() {
        this.isShowMenuPaint = !this.isShowMenuPaint;
        this.switchMenus(this.domMenuPaint, 'right', this.isShowMenuPaint);
    }
    this.toggleMenuVoxels = function() {
        this.isShowMenuVoxels = !this.isShowMenuVoxels;
        this.switchMenus(this.domMenuVoxels, 'right', this.isShowMenuVoxels);
    }
    this.toggleMenuBakery = function() {
        this.isShowMenuBakery = !this.isShowMenuBakery;
        this.switchMenus(this.domMenuBakery, 'right', this.isShowMenuBakery);
    }
    this.toggleMenuMeshes = function() {
        this.isShowMenuMeshes = !this.isShowMenuMeshes;
        this.switchMenus(this.domMenuMeshes, 'right', this.isShowMenuMeshes);
    }

    this.toggleMenuPathtracer = function() {
        this.isShowMenuPathtracer = !this.isShowMenuPathtracer;
        this.switchMenus(this.domMenuPathtracer, 'left', this.isShowMenuPathtracer);
    }
    this.toggleMenuCamera = function() {
        this.isShowMenuCamera = !this.isShowMenuCamera;
        this.switchMenus(this.domMenuCamera, 'left', this.isShowMenuCamera);
    }
    this.toggleMenuEnv = function() {
        this.isShowMenuEnv = !this.isShowMenuEnv;
        this.switchMenus(this.domMenuEnv, 'left', this.isShowMenuEnv);
    }
    this.toggleMenuMaterial = function() {
        this.isShowMenuMaterial = !this.isShowMenuMaterial;
        this.switchMenus(this.domMenuMaterial, 'left', this.isShowMenuMaterial);
    }
    this.toggleMenuTexture = function() {
        this.isShowMenuTexture = !this.isShowMenuTexture;
        this.switchMenus(this.domMenuTexture, 'left', this.isShowMenuTexture);
    }
    this.toggleMenuRender = function() {
        this.isShowMenuRender = !this.isShowMenuRender;
        this.switchMenus(this.domMenuRender, 'left', this.isShowMenuRender);
    }
    this.toggleMenuStorage = function() {
        this.isShowMenuStorage = !this.isShowMenuStorage;
        this.switchMenus(this.domMenuStorage, 'left', this.isShowMenuStorage);
    }
    this.toggleMenuGroups = function() {
        this.isShowMenuGroups = !this.isShowMenuGroups;
        this.switchMenus(this.domMenuGroups, 'left', this.isShowMenuGroups);
    }

    this.clearAllMenus = function(side, exclude = []) {
        if (side == 'right' || side == 'both') {
            if (exclude.indexOf(this.domMenuAbout) == -1) {
                this.domMenuAbout.style.transform = styleMenuR;
                this.isShowMenuAbout = false;
            }
            if (exclude.indexOf(this.domMenuPrefs) == -1) {
                this.domMenuPrefs.style.transform = styleMenuR;
                this.isShowMenuPrefs = false;
            }
            if (exclude.indexOf(this.domMenuFile) == -1) {
                this.domMenuFile.style.transform = styleMenuR;
                this.isShowMenuFile = false;
            }
            if (exclude.indexOf(this.domMenuGenerator) == -1) {
                this.domMenuGenerator.style.transform = styleMenuR;
                this.isShowMenuGenerator = false;
            }
            if (exclude.indexOf(this.domMenuVoxelizer) == -1) {
                this.domMenuVoxelizer.style.transform = styleMenuR;
                this.isShowMenuVoxelizer = false;
            }
            if (exclude.indexOf(this.domMenuSymmetry) == -1) {
                this.domMenuSymmetry.style.transform = styleMenuR;
                this.isShowMenuSymmetry = false;
            }
            if (exclude.indexOf(this.domMenuModel) == -1) {
                this.domMenuModel.style.transform = styleMenuR;
                this.isShowMenuModel = false;
            }
            if (exclude.indexOf(this.domMenuPaint) == -1) {
                this.domMenuPaint.style.transform = styleMenuR;
                this.isShowMenuPaint = false;
            }
            if (exclude.indexOf(this.domMenuVoxels) == -1) {
                this.domMenuVoxels.style.transform = styleMenuR;
                this.isShowMenuVoxels = false;
            }
            if (exclude.indexOf(this.domMenuBakery) == -1) {
                this.domMenuBakery.style.transform = styleMenuR;
                this.isShowMenuBakery = false;
            }
            if (exclude.indexOf(this.domMenuMeshes) == -1) {
                this.domMenuMeshes.style.transform = styleMenuR;
                this.isShowMenuMeshes = false;
            }
        }
        if (side == 'left' || side == 'both') {
            if (exclude.indexOf(this.domMenuPathtracer) == -1) {
                this.domMenuPathtracer.style.transform = styleMenuL;
                this.isShowMenuPathtracer = false;
            }
            if (exclude.indexOf(this.domMenuCamera) == -1) {
                this.domMenuCamera.style.transform = styleMenuL;
                this.isShowMenuCamera = false;
            }
            if (exclude.indexOf(this.domMenuEnv) == -1) {
                this.domMenuEnv.style.transform = styleMenuL;
                this.isShowMenuEnv = false;
            }
            if (exclude.indexOf(this.domMenuMaterial) == -1) {
                this.domMenuMaterial.style.transform = styleMenuL;
                this.isShowMenuMaterial = false;
            }
            if (exclude.indexOf(this.domMenuTexture) == -1) {
                this.domMenuTexture.style.transform = styleMenuL;
                this.isShowMenuTexture = false;
            }
            if (exclude.indexOf(this.domMenuRender) == -1) {
                this.domMenuRender.style.transform = styleMenuL;
                this.isShowMenuRender = false;
            }
            if (exclude.indexOf(this.domMenuStorage) == -1) {
                this.domMenuStorage.style.transform = styleMenuL;
                this.isShowMenuStorage = false;
            }
            if (exclude.indexOf(this.domMenuGroups) == -1) {
                this.domMenuGroups.style.transform = styleMenuL;
                this.isShowMenuGroups = false;
            }
        }
    }

    this.switchMenus = function(dom, side, isEnabled) {
        this.clearAllMenus(side, [ dom ]);
        if (isEnabled) {
            if (side == 'right') dom.style.transform = styleMenuR_open;
            if (side == 'left')  dom.style.transform = styleMenuL_open;
        } else {
            if (side == 'right') dom.style.transform = styleMenuR;
            if (side == 'left')  dom.style.transform = styleMenuL;
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
            if (!uix.isWorkplane) {
                this.domInfo[2].innerHTML = palette.uniqueColors.length + ' COL';
            } else {
                this.domInfo[2].innerHTML = `X: ${
                    helper.workPlane.position.x.toFixed(1)
                } | Y: ${
                    (helper.workPlane.position.y + 0.5).toFixed(1)
                } | Z: ${
                    helper.workPlane.position.z.toFixed(1)
                }`;
            }
        } else if (MODE == 1) {
            this.domInfo[1].innerHTML = bakery.meshes.length + ' MSH';
            this.domInfo[2].innerHTML = scene.getTotalVertices() - builder.SPS.mesh.subMeshes[0].verticesCount + ' VTX';
        } else if (MODE == 2) {
            this.domInfo[1].innerHTML = 'FOV ' + camera.camera2.fov;
            this.domInfo[2].innerHTML = 'HUE ' + ui.domPipelineHue.value;
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
            this.domToolbarC.style.display = 'none';
            this.domToolbarC_mem.style.display = 'none';
            this.domToolbarL.style.display = 'none';
            this.domToolbarR.style.display = 'none';
            this.domHover.style.display = 'none';
            this.domPalette.style.display = 'none';
            this.domBakeList.style.display = 'none';
            this.domColorPicker.style.display = 'none';
            this.domMenuInScreen.style.display = 'none';
            this.domReticle.style.display = 'none';
            this.domInfoParent.style.display = 'none';
        } else {
            this.domToolbarC.style.display = 'unset';
            this.domToolbarC_mem.style.display = 'unset';
            this.domToolbarL.style.display = 'unset';
            this.domToolbarR.style.display = 'unset';
            if (MODE == 0) {
                this.domHover.style.display = 'unset';
                this.domPalette.style.display = 'unset';
                this.domColorPicker.style.display = 'unset';
                this.domMenuInScreen.style.display = 'unset';
                palette.create();
            }
            if (MODE == 1) {
                this.domBakeList.style.display = 'unset';
            }
            if (MODE == 2) {
                this.domReticle.style.display = 'grid';
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
            scene.debugLayer.show();
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
    this.joysticks = []; // [left, right]
    this.workplaneGizmos = [];
    this.isWorkplane = false;
    this.sunNode = null;
    this.sunGizmoUp = null;
    this.sunGizmoNews = null;

    this.init = function() {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", {}, scene);
        this.utilLayer = new BABYLON.UtilityLayerRenderer(scene);
        this.utilLayer.utilityLayerScene.autoClearDepthAndStencil = true;
        this.createAdvancedColorPicker();

        this.workplaneGizmos[0] = new BABYLON.AxisDragGizmo(BABYLON.Axis.X, BABYLON.Color3.Red(), this.utilLayer, undefined, 5);
        this.workplaneGizmos[1] = new BABYLON.AxisDragGizmo(BABYLON.Axis.Y, BABYLON.Color3.Green(), this.utilLayer, undefined, 5);
        this.workplaneGizmos[2] = new BABYLON.AxisDragGizmo(BABYLON.Axis.Z, BABYLON.Color3.Blue(), this.utilLayer, undefined, 5);
        this.workplaneGizmos[3] = new BABYLON.AxisScaleGizmo(BABYLON.Axis.X, BABYLON.Color3.Red(), this.utilLayer, undefined, 6);
        this.workplaneGizmos[4] = new BABYLON.AxisScaleGizmo(BABYLON.Axis.Y, BABYLON.Color3.Green(), this.utilLayer, undefined, 6);
        this.workplaneGizmos[5] = new BABYLON.AxisScaleGizmo(BABYLON.Axis.Z, BABYLON.Color3.Blue(), this.utilLayer, undefined, 6);
        this.workplaneGizmos[6] = new BABYLON.AxisDragGizmo(BABYLON.Axis.X, BABYLON.Color3.Yellow(), this.utilLayer, undefined, 1);
        this.disposeWorkplaneGizmo(); // important, startup artifact

        this.initSunLocator();
        this.initJoysticks();
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
        this.colorPicker.onValueChangedObservable.add((value) => { //color3
            currentColor = value.toHexString();
            ui.domColorPicker.value = currentColor;
        });
        panel.addControl(this.colorPicker);
    }

    this.bindTransformGizmo = function(meshes) {
        this.unbindTransformGizmo();
        this.gizmo = new BABYLON.GizmoManager(scene, 5, new BABYLON.UtilityLayerRenderer(scene));
        this.gizmo.positionGizmoEnabled = true;
        this.gizmo.rotationGizmoEnabled = true;
        this.gizmo.scaleGizmoEnabled = false;
        this.gizmo.usePointerToAttachGizmos = true;
        this.gizmo.clearGizmoOnEmptyPointerEvent = false; // handled manually on pointer events

        this.gizmo.gizmos.positionGizmo.scaleRatio = 0.5;
        this.gizmo.gizmos.positionGizmo.snapDistance  = 0.5;
        this.gizmo.gizmos.positionGizmo.xPlaneGizmo.snapDistance = 1;
        this.gizmo.gizmos.positionGizmo.yPlaneGizmo.snapDistance = 1;
        this.gizmo.gizmos.positionGizmo.zPlaneGizmo.snapDistance = 1;
        this.gizmo.gizmos.positionGizmo.planarGizmoEnabled = preferences.getBakeryPlanarGizmo();
        this.gizmo.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = true;
        [this.gizmo.gizmos.positionGizmo.xGizmo,
            this.gizmo.gizmos.positionGizmo.yGizmo,
            this.gizmo.gizmos.positionGizmo.zGizmo,
            this.gizmo.gizmos.positionGizmo.xPlaneGizmo,
            this.gizmo.gizmos.positionGizmo.yPlaneGizmo,
            this.gizmo.gizmos.positionGizmo.zPlaneGizmo].forEach((gizmo) => {
                gizmo.dragBehavior.onDragObservable.add(() => {
                    light.updateShadowMap();
                });
            });
        
        this.gizmo.gizmos.rotationGizmo.scaleRatio = 0.25;
        this.gizmo.gizmos.rotationGizmo.snapDistance = Math.PI / 8;
        this.gizmo.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = false;
        [this.gizmo.gizmos.rotationGizmo.xGizmo,
            this.gizmo.gizmos.rotationGizmo.yGizmo,
            this.gizmo.gizmos.rotationGizmo.zGizmo].forEach((gizmo) => {
                gizmo.dragBehavior.onDragObservable.add(() => {
                    light.updateShadowMap();
                });
            });

        this.gizmo.attachableMeshes = meshes;
        this.gizmo.onAttachedToMeshObservable.add((mesh) => {
            toolBakery.onGizmoAttached(mesh);
        });
    }

    this.unbindTransformGizmo = function() {
        if (this.gizmo) {
            this.gizmo.dispose();
            this.gizmo = null;
        }
    }

    this.bindWorkplane = function(workplane = helper.workPlane) {
        workplane.isVisible = true;
        ui.domWorkplaneBtn.firstChild.style.color = COL_ORANGE;

        this.workplaneGizmos[0].scaleRatio = 0.5;
        this.workplaneGizmos[0].snapDistance = 0.5;
        this.workplaneGizmos[0].attachedMesh = workplane;
        this.workplaneGizmos[0].updateGizmoRotationToMatchAttachedMesh = false;
        this.workplaneGizmos[0].dragBehavior.onDragStartObservable.add(() => {
            workplane.visibility = 0.5;
            uix.setWorkplaneGizmoVisibility(0.3);
        });
        this.workplaneGizmos[0].dragBehavior.onDragEndObservable.add(() => {
            workplane.visibility = 0.3;
            uix.setWorkplaneGizmoVisibility(1);
        });
        
        this.workplaneGizmos[1].scaleRatio = 0.5;
        this.workplaneGizmos[1].snapDistance = 0.5;
        this.workplaneGizmos[1].attachedMesh = workplane;
        this.workplaneGizmos[1].updateGizmoRotationToMatchAttachedMesh = false;
        this.workplaneGizmos[1].dragBehavior.onDragStartObservable.add(() => {
            workplane.visibility = 0.5;
            uix.setWorkplaneGizmoVisibility(0.3);
        });
        this.workplaneGizmos[1].dragBehavior.onDragEndObservable.add(() => {
            workplane.visibility = 0.3;
            uix.setWorkplaneGizmoVisibility(1);
        });

        this.workplaneGizmos[2].scaleRatio = 0.5;
        this.workplaneGizmos[2].snapDistance = 0.5;
        this.workplaneGizmos[2].attachedMesh = workplane;
        this.workplaneGizmos[2].updateGizmoRotationToMatchAttachedMesh = false;
        this.workplaneGizmos[2].dragBehavior.onDragStartObservable.add(() => {
            workplane.visibility = 0.5;
            uix.setWorkplaneGizmoVisibility(0.3);
        });
        this.workplaneGizmos[2].dragBehavior.onDragEndObservable.add(() => {
            workplane.visibility = 0.3;
            uix.setWorkplaneGizmoVisibility(1);
        });

        this.workplaneGizmos[3].scaleRatio = -0.3;
        this.workplaneGizmos[3].attachedMesh = workplane;
        this.workplaneGizmos[3].updateGizmoRotationToMatchAttachedMesh = false;
        this.workplaneGizmos[3].dragBehavior.onDragStartObservable.add(() => {
            this.workplaneGizmos[3].dragBehavior._enabled = false;
            helper.setWorkPlane(BABYLON.Axis.X);
        });
        this.workplaneGizmos[3].dragBehavior.onDragEndObservable.add(() => {
            this.workplaneGizmos[3].dragBehavior._enabled = true;
        });

        this.workplaneGizmos[4].scaleRatio = -0.3;
        this.workplaneGizmos[4].attachedMesh = workplane;
        this.workplaneGizmos[4].updateGizmoRotationToMatchAttachedMesh = false;
        this.workplaneGizmos[4].dragBehavior.onDragStartObservable.add(() => {
            this.workplaneGizmos[4].dragBehavior._enabled = false;
            helper.setWorkPlane(BABYLON.Axis.Y);
        });
        this.workplaneGizmos[4].dragBehavior.onDragEndObservable.add(() => {
            this.workplaneGizmos[4].dragBehavior._enabled = true;
        });

        this.workplaneGizmos[5].scaleRatio = -0.3;
        this.workplaneGizmos[5].attachedMesh = workplane;
        this.workplaneGizmos[5].updateGizmoRotationToMatchAttachedMesh = false;
        this.workplaneGizmos[5].dragBehavior.onDragStartObservable.add(() => {
            this.workplaneGizmos[5].dragBehavior._enabled = false;
            helper.setWorkPlane(BABYLON.Axis.Z);
        });
        this.workplaneGizmos[5].dragBehavior.onDragEndObservable.add(() => {
            this.workplaneGizmos[5].dragBehavior._enabled = true;
        });

        this.workplaneGizmos[6].scaleRatio = 0.015;
        this.workplaneGizmos[6].attachedMesh = workplane;
        this.workplaneGizmos[6].updateGizmoRotationToMatchAttachedMesh = false;
        this.workplaneGizmos[6].dragBehavior.onDragStartObservable.add(() => {
            this.workplaneGizmos[6].dragBehavior._enabled = false;
            helper.resetWorkplane(true);
        });
        this.workplaneGizmos[6].dragBehavior.onDragEndObservable.add(() => {
            this.workplaneGizmos[6].dragBehavior._enabled = true;
        });

        const sphere = BABYLON.MeshBuilder.CreateSphere("workplane_reset", { sideOrientation: BABYLON.Mesh.FRONTSIDE, updatable: false }, this.workplaneGizmos[6].gizmoLayer.utilityLayerScene);
        sphere.renderOverlay = true;
        sphere.overlayColor = BABYLON.Color3.Teal();
        sphere.overlayAlpha = 1;
        sphere.doNotSerialize = true;
        sphere.convertToUnIndexedMesh();
        sphere.freezeNormals();
        this.workplaneGizmos[6].setCustomMesh(sphere);
    }

    this.unbindWorkplane = function() {
        ui.domWorkplaneBtn.firstChild.style.color = COL_AQUA;
        helper.workPlane.isVisible = false;
        this.disposeWorkplaneGizmo();
    }

    this.disposeWorkplaneGizmo = function() {
        for (let i = 0; i < this.workplaneGizmos.length; i++)
            this.workplaneGizmos[i].attachedMesh = null;
    }

    this.setWorkplaneGizmoVisibility = function(visibility) {
        for (let i = 0; i < this.workplaneGizmos.length; i++)
            this.workplaneGizmos[i]._coloredMaterial.alpha = visibility;
    }

    this.initSunLocator = function() {
        this.sunNode = new BABYLON.TransformNode();
        this.sunNode.rotation.x = PIH;
        this.sunNode.rotation.y = light.SUN_ANG * Math.PI / 180;
        this.sunNode.isVisible = false;
        this.sunNode.doNotSerialize = true;

        this.sunGizmoUp = new BABYLON.AxisScaleGizmo(BABYLON.Axis.Y, BABYLON.Color3.FromHexString(COL_AQUA), this.utilLayer, undefined, 2);
        this.sunGizmoUp.scaleRatio = 0.7;
        this.sunGizmoUp.sensitivity = 5.0;
        this.sunGizmoUp.attachedMesh = null;
        this.sunGizmoUp.uniformScaling = true;
        this.sunGizmoUp.updateGizmoRotationToMatchAttachedMesh = false;
        this.sunGizmoUp.dragBehavior.onDragObservable.add(() => {
            light.updateHeight(light.SUN_POS.y / uix.sunNode.scaling.x);
        });

        this.sunGizmoNews = new BABYLON.PlaneRotationGizmo(BABYLON.Axis.Y, BABYLON.Color3.FromHexString(COL_AQUA), this.utilLayer);
        this.sunGizmoNews.scaleRatio = 1;
        this.sunGizmoNews.attachedMesh = null;
        this.sunGizmoNews.updateGizmoRotationToMatchAttachedMesh = false;
        this.sunGizmoNews.dragBehavior.onDragObservable.add(() => {
            light.updateAngle(uix.sunNode.rotation.y * 180 / Math.PI);
        });
    }

    this.showSunLocator = function() {
        this.sunGizmoUp.attachedMesh = this.sunNode;
        this.sunGizmoNews.attachedMesh = this.sunNode;
    }

    this.hideSunLocator = function() {
        this.sunGizmoUp.attachedMesh = null;
        this.sunGizmoNews.attachedMesh = null;
    }

    this.initJoysticks = function() { // freeCameraVirtualJoystickInput.ts
        this.joysticks[0] = new BABYLON.VirtualJoystick(true);
        this.joysticks[0].setAxisForUpDown(BABYLON.JoystickAxis.Z);
        this.joysticks[0].setAxisForLeftRight(BABYLON.JoystickAxis.X);
        this.joysticks[0].setJoystickSensibility(0.15);
        this.joysticks[0].setJoystickColor("#00ffff30");
        this.joysticks[0].reverseLeftRight = true; // using right-handed system
        this.joysticks[1] = new BABYLON.VirtualJoystick(false);
        this.joysticks[1].setAxisForUpDown(BABYLON.JoystickAxis.X);
        this.joysticks[1].setAxisForLeftRight(BABYLON.JoystickAxis.Y);
        this.joysticks[1].setJoystickSensibility(0.015);
        this.joysticks[1].setJoystickColor("#00ffff30");
        this.joysticks[1].reverseUpDown = true;
        this.joysticks[1].reverseLeftRight = true;
        //this.joysticks[0].puckSize = 5; // introduce artifacts,
        //this.joysticks[0].containerSize = 50; // canvas clear issue
        BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1"; // initialize
        BABYLON.VirtualJoystick.Canvas.style.background = "none";

        scene.onBeforeRenderObservable.add(() => {
            if (MODE == 2 && this.joysticks[0]) {
                const speed = camera.camera2._computeLocalCameraSpeed() * 50;
                const cameraTransform = BABYLON.Matrix.RotationYawPitchRoll(
                    camera.camera2.rotation.y, camera.camera2.rotation.x, 0);
                const deltaTransform = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(
                        this.joysticks[0].deltaPosition.x * speed,
                        this.joysticks[0].deltaPosition.y * speed,
                        this.joysticks[0].deltaPosition.z * speed),
                        cameraTransform);
                        
                camera.camera2.cameraDirection = camera.camera2.cameraDirection.add(deltaTransform);
                camera.camera2.cameraRotation = camera.camera2.cameraRotation.addVector3(this.joysticks[1].deltaPosition);

                if (!this.joysticks[0].pressed)
                    this.joysticks[0].deltaPosition = this.joysticks[0].deltaPosition.scale(0.9);
                if (!this.joysticks[1].pressed)
                    this.joysticks[1].deltaPosition = this.joysticks[1].deltaPosition.scale(0.9);
            }
        });
    }

    this.showJoysticks = function(isVisible) {
        if (isVisible) {
            BABYLON.VirtualJoystick.Canvas.style.zIndex = "5";
        } else {
            BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1";
        }
    }

    this.toggleJoysticks = function() {
        if (BABYLON.VirtualJoystick.Canvas.style.zIndex == "-1") {
            BABYLON.VirtualJoystick.Canvas.style.zIndex = "5";
        } else {
            BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1";
        }
    }

    this.init();
}


// -------------------------------------------------------
// Preferences


function Preferences() {
    const KEY_NOINTRO = "pref_nointro";
    const KEY_NOHOVER = "pref_nohover";
    const KEY_WEBSOCKET = "pref_websocket";
    const KEY_WEBSOCKET_URL = "pref_websocket_url";
    const KEY_PALETTE_SIZE = "pref_palette_size";
    const KEY_BAKERY_PLANARGIZMO = "pref_bakery_planargizmo";

    this.init = function() {
        document.getElementById(KEY_NOINTRO).checked = false;
        document.getElementById(KEY_NOHOVER).checked = false;
        document.getElementById(KEY_WEBSOCKET).checked = false;
        document.getElementById(KEY_WEBSOCKET_URL).value = "localhost:8011";
        document.getElementById(KEY_PALETTE_SIZE).value = 1;
        document.getElementById(KEY_BAKERY_PLANARGIZMO).value = false;

        initPrefCheck(KEY_NOINTRO);
        initPrefCheck(KEY_NOHOVER);
        initPrefCheck(KEY_WEBSOCKET);
        initPref(KEY_WEBSOCKET_URL);
        initPref(KEY_PALETTE_SIZE);
        initPrefCheck(KEY_BAKERY_PLANARGIZMO, (checked) => {
            if (uix.gizmo)
                uix.gizmo.gizmos.positionGizmo.planarGizmoEnabled = checked;
        });
    }

    this.finish = function() {
        (this.getNoIntro()) ?
            document.getElementById(KEY_NOINTRO).checked = true :
            document.getElementById(KEY_NOINTRO).checked = false;

        ui.toggleHover(!this.getNoHover());

        palette.expand(this.getPaletteSize());

        if (this.getWebsocket()) {
            client.ws_connect();
            ui.domInfoWebsocket.style.display = "unset";
        }

        // inject the modules entry point
        const scriptModules = document.createElement('script');
        scriptModules.type = 'module';
        scriptModules.src = 'src/module.js';
        document.body.appendChild(scriptModules);

        // inject the user modules entry point
        const scriptUserModules = document.createElement('script');
        scriptUserModules.type = 'module';
        scriptUserModules.src = 'modules/user.js';
        document.body.appendChild(scriptUserModules);
    }

    this.setNoIntro = function(isEnabled) {
        localStorage.setItem(KEY_NOINTRO, isEnabled);
    }

    this.getNoIntro = function() {
        return document.getElementById(KEY_NOINTRO).checked;
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

    this.getBakeryPlanarGizmo = function() {
        return document.getElementById(KEY_BAKERY_PLANARGIZMO).checked;
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
            scene.stopAnimation(camera.camera0); // stop camera animator()
            if (MODE == 0) tool.handleToolDown();
            else if (MODE == 1) toolBakery.onToolDown();
            break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
            if (MODE == 0) tool.handleToolMove();
            else if (MODE == 1) toolBakery.onToolMove();
            break;
        case BABYLON.PointerEventTypes.POINTERUP:
            if (MODE == 0) tool.handleToolUp();
            else if (MODE == 1) toolBakery.onToolUp();
            break;
        case BABYLON.PointerEventTypes.POINTERWHEEL:
            scene.stopAnimation(camera.camera0);
            break;
    }
});

document.addEventListener("keydown", (ev) => {
    if (ev.target.matches(".ignorekeys")) return;
    if (ev.key == '/') ui.toggleDebugMode();
    if (scene.debugLayer.isVisible()) return;
    
    switch (ev.key) {
        case ' ':
            if (MODE == 0) tool.toolSelector('camera');
            if (MODE == 2) camera.jump();
            break;
        case '`':
            if (MODE == 0) tool.toolSelector('camera');
            break;
        case '1':
            if (MODE == 0) tool.toolSelector('add');
            break;
        case '2':
            if (MODE == 0) tool.toolSelector('boxadd');
            break;
        case '3':
            if (MODE == 0) tool.toolSelector('boxrem');
            break;
        case '4':
            if (MODE == 0) tool.toolSelector('remove');
            break;
        case '5':
            if (MODE == 0) tool.toolSelector('eyedrop');
            break;
        case '6':
            if (MODE == 0) tool.toolSelector('bucket');
            break;
        case '7':
            if (MODE == 0) tool.toolSelector('paint');
            break;
        case '8':
            if (MODE == 0) tool.toolSelector('boxpaint');
            break;
        case 's':
            if (MODE == 0) symmetry.switchAxis();
            break;
        case 'w':
            if (MODE == 0) helper.toggleWorkplane();
            break;
        case 'c':
            if (MODE == 1) bakery.cloneSelected();
            break;
        case 'Delete':
            if (MODE == 1) bakery.deleteSelected();
            break;
        case 'f':
            camera.frame();
            break;
        case 'r':
            if (MODE == 0 || MODE == 1) {
                if (window.pt)
                    window.pt.toggle();
            }
            break;
    }

    if (ev.ctrlKey && ev.key === 'l')
        document.getElementById('openfile_vbx').click();
    
    if (MODE == 0) {
        if (ev.ctrlKey && ev.key === 'z') {
            ev.preventDefault();
            memory.undo();
        }
        if (ev.ctrlKey && ev.key === 'x') {
            ev.preventDefault();
            memory.redo();
        }
    }
}, false);

canvas.addEventListener("keydown", (ev) => {
    if (MODE == 2) {
        if (ev.shiftKey)
            camera.speedUp();
    }
}, false);

function fileHandler(file) {
    const ext = file.name.split('.').pop().toLowerCase(); //ext|exts
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = () => {
        if (ext === 'vbx') project.load(reader.result);
        if (ext === 'obj') if (MODE == 0) voxelizer.importMeshOBJ(url);
        if (ext === 'glb') if (MODE == 0) voxelizer.importMeshGLB(url);
        if (ext === 'vox') project.loadMagicaVoxel(reader.result);
        if (ext === 'hdr') hdri.loadHDR(url);
        if (MODE == 0) {
            if (['jpg','png','svg'].includes(ext)) voxelizer.voxelize2D(reader.result);
        } else {
            if (['jpg','png'].includes(ext)) material.addTexture(reader.result);
        }
        URL.revokeObjectURL(url);
    }
    if (ext === 'vbx') {
        reader.readAsText(file);
    } else if (ext === 'vox') {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsDataURL(file);
    }
}

function fileHandlerNoDrop(file) {
    const ext = file.name.split('.').pop().toLowerCase(); //ext|exts
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = () => {
        if (ext === 'vbx') project.importBakes(reader.result);
        URL.revokeObjectURL(url);
    }
    if (ext === 'vbx') {
        reader.readAsText(file);
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

document.getElementById('openfile_vbx').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandler(ev.target.files[0]);
}, false);

document.getElementById('openfile_vbx_import').addEventListener("change", (ev) => {
    if (ev.target.files.length > 0)
        fileHandlerNoDrop(ev.target.files[0]);
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

    updateAxisViewViewport();

    if (MODE == 0)
        palette.create();

    if (isOffScreen(ui.domHover))
        ui.hoverTranslate(ui.domHover, 0, 0);
}, false);


// -------------------------------------------------------
// Websocket Client


function WebsocketClient() {
    let socket = null;
    let timeout = null;

    this.init = function() {
        document.getElementById("pref_websocket").addEventListener("input", () => {
            (preferences.getWebsocket()) ? client.ws_connect() : client.close();
        }, false);
    }

    this.ws_connect = function() {
        try {
            socket = new WebSocket("ws://" + preferences.getWebsocketUrl());
            ui.domInfoWebsocket.style.display = "unset";
        } catch (err) {
            ui.notification("invalid websocket address");
            return;
        }
        
        socket.onopen = () => {
            ui.domInfoWebsocket.innerHTML = "Connected";
            if (MODE == 0) {
                socket.send(JSON.stringify({
                    voxels: builder.voxels.map((item) => {
                        if (item.position._isDirty)
                            delete item.position._isDirty
                        return item;
                    })
                }));
            }
        }

        socket.onmessage = (msg) => {
            if (MODE == 0)
                onReceive(msg);
        }

        socket.onclose = () => {
            ui.domInfoWebsocket.innerHTML = "Disconnected";
            console.clear();
            clearTimeout(timeout);
            if (preferences.getWebsocket())
                timeout = setTimeout(client.ws_connect, 3000);
        }
    }

    this.ws_send = function(voxels) {
        if (socket && socket.readyState == WebSocket.OPEN) {
            socket.send(JSON.stringify({
                voxels: voxels.map((item) => {
                    if (item.position._isDirty)
                        delete item.position._isDirty
                    return item;
                })
            }));
        }
    }

    this.close = function() {
        ui.domInfoWebsocket.style.display = "none";
        clearTimeout(timeout);
        socket = null;
    }

    function onReceive(msg) {
        const voxels = JSON.parse(msg.data).voxels;
        const data = [];
        for (let i = 0; i < voxels.length; i++) {
            data.push({ 
                position: new BABYLON.Vector3(
                    voxels[i].position.x,
                    voxels[i].position.y,
                    voxels[i].position.z,
                ),
                color: voxels[i].color.toUpperCase(),
                visible: parseBool(voxels[i].visible)
            });
        }
        builder.loadData(data, false, false);
    }

    this.init();
}


// -------------------------------------------------------
// Utils


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
function animator(target, property, from, to, fps=3, frames=2, callback=null) {
    BABYLON.Animation.CreateAndStartAnimation('animator',
        target, property, fps, frames, from, to, 0, easingFunction, callback);
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
    // normalize scale
    const scaleFactor = Math.min(scale / size.x, scale / size.y, scale / size.z);
    const scaleMatrix = BABYLON.Matrix.Scaling(scaleFactor, scaleFactor, scaleFactor);
    // center mesh and drop to floor
    const nX = -bounds.maximum.x + (size.x / 2);
    const nY = (size.y / 2) - bounds.boundingBox.center.y;
    const nZ = -bounds.maximum.z + (size.z / 2);
    const transMatrix = BABYLON.Matrix.Translation(nX, nY, nZ);
    // bake matrices
    const matrix = transMatrix.multiply(scaleMatrix);
    mesh.bakeTransformIntoVertices(matrix);
}

function resetPivot(mesh) {
    const center = mesh.getBoundingInfo().boundingBox.centerWorld;
    mesh.setPivotMatrix(BABYLON.Matrix.Translation(-center.x, -center.y, -center.z), false);
    mesh.bakeCurrentTransformIntoVertices();
    mesh.setPivotMatrix(BABYLON.Matrix.Identity());
    mesh.position = center;
    mesh.refreshBoundingInfo();
}

function textureToImage(texture) {
    return new Promise ((resolve) => {
        texture.readPixels().then((pixels) => {
            const c = document.createElement('canvas');
            c.width = texture._cachedSize.width;
            c.height = texture._cachedSize.height;
            const imgData = c.getContext('2d').getImageData(0, 0, c.width, c.height);
            const data = imgData.data;
            for (let i = 0; i < imgData.data.length; i++)
                data[i] = pixels[i];
            c.getContext('2d').putImageData(imgData, 0, 0);
            resolve(c.toDataURL('image/png'));
        });
    });
}

function createScreenshot(scale = 4) {
    if (window.ptIsActive()) {
        window.pt.shot();
        return;
    }

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
            if (MODE !== 2) {
                helper.gridPlane.isVisible = true;
                uix.colorPicker.isVisible = (MODE == 0);
            }
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
            if (MODE !== 2) {
                helper.gridPlane.isVisible = true;
                uix.colorPicker.isVisible = (MODE == 0);
            }
            callback(data);
    });
}

function clearCache() {
    engine.clearInternalTexturesCache();
    scene.cleanCachedTextureBuffer();
    BABYLON.Tools.ClearLogCache();
    memory.clear();
    ui.notification('cache cleared');
}

function downloadText(txt, filename) {
    const blob = new Blob([ txt ], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadImage(imgSrc, filename) {
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = filename;
    a.click();
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

async function saveFile(blob, filename, reject) {
    // to show a file dialog in Chrome
    if (!isElectron() && !isMobileDevice()) {
        try {
            const fileHandle = await self.showSaveFilePicker({
                suggestedName: filename,
                types: [ { description: "File" } ]
            });
            const writeFile = async (fileHandle, contents) => {
                const writable = await fileHandle.createWritable();
                await writable.write(contents);
                await writable.close();
            };
            writeFile(fileHandle, blob).then(() => {
                //
            });
        } catch (err) {
            // canceled
        }
    } else { // showSaveFilePicker browser compatibility
        reject();
    }
}

function saveDialog(data, filename) {
    const blob = new Blob([ data ], { type: "text/plain" });
    saveFile(blob, filename, () => {
        downloadText(data, filename);
    });
}

function saveDialogImage(data, filename) {
    const blob = dataURItoBlob(data);
    saveFile(blob, filename, () => {
        downloadImage(data, filename);
    });
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ ab ], { type: mimeString });
    return blob;
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

function isOffScreen(elem) {
    const rect = elem.getBoundingClientRect(); // 20 = minimum required event space
    return ((rect.x + (rect.width/2) - 20) < 0 || (rect.x + 20) > window.innerWidth ||
            (rect.y + 20) < 0 || (rect.y + 20) > window.innerHeight);
}

function aspectRatioFit(srcW, srcH, maxW, maxH) {
    const ratio = Math.min(maxW / srcW, maxH / srcH);
    return { width: srcW * ratio, height: srcH * ratio };
}

function rgbIntToHex(r, g, b) {
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
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: Math.pow((parseInt(result[1], 16) / 255), gamma),
        g: Math.pow((parseInt(result[2], 16) / 255), gamma),
        b: Math.pow((parseInt(result[3], 16) / 255), gamma)
    } : null;
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
    return rgbIntToHex(data[0], data[1], data[2]);
}

function randomRangeInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function parseBool(val) {
    return val === true || val === "true";
}
