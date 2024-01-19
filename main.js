(()=>{"use strict";var t,e,n="popup_is-animated",o="popup_is-opened",r="Сохранение...",a="card__image",c="card__delete-button",i="card__like-button",s="card__like-button_is-active",u={formSelector:".popup__form",inputSelector:".popup__input",submitButtonSelector:".popup__button",inactiveButtonClass:"popup__button_disabled",inputErrorClass:"popup__input_type_error",errorClass:"popup__error_visible"},l=function(t,e){t.remove(),t.removeEventListener("click",e)},d=function(t,e,n,o,r,u){var d=e.querySelector(".card").cloneNode(!0),p=d.querySelector("."+a),f=d.querySelector(".card__title"),m=d.querySelector("."+c),v=d.querySelector("."+i),_=d.querySelector(".card__like-counter");return p.src=t.link,p.alt="фотография с изображением места "+t.name,f.textContent=t.name,t.owner._id!==u._id&&m.remove(),t.likes.some((function(t){return t._id===u._id}))&&v.classList.add(s),o(v,_,t,null),d.addEventListener("click",(function e(s){var m=s.target.classList;m.contains(a)?r(f,p):m.contains(i)?o(v,_,t,u._id):m.contains(c)&&n(d,l,e,t)})),d},p=function(t,e){t.classList.remove(o),document.removeEventListener("click",e),document.removeEventListener("keydown",e)},f=function(t,e){return t.querySelector(".".concat(t.getAttribute("name"),"__").concat(e.name,"--error"))},m=function(t,e){t.hasAttribute("disabled")||(t.setAttribute("disabled",""),t.classList.add(e))},v=function(t,e){t.setCustomValidity(e)},_=function(t,e,n){n.textContent="",n.classList.remove(e.errorClass),t.classList.remove(e.inputErrorClass)},h=function(t){return t.validity.patternMismatch?t.dataset.patternError?v(t,t.dataset.patternError):console.log("WARNING: error message for pattern is missing in the markup of the input ".concat(t.name)):v(t,""),t.validity.valid},b=function(t,e){m(function(t){return Array.from(t.elements).find((function(t){return"submit"===t.type}))}(t),e.inactiveButtonClass),Array.from(t.elements).forEach((function(n){"INPUT"===n.nodeName&&_(n,e,f(t,n))}))},y={baseUrl:"https://nomoreparties.co/v1/".concat("wff-cohort-5"),headers:{authorization:"9b1a6b52-28b2-4d5c-8007-f394db7e5a58","Content-Type":"application/json"}},C=function(t){return t.ok?t.json():Promise.reject("Ошибка: ".concat(t.status))},g=function(t){return fetch("".concat(y.baseUrl).concat(t),{headers:y.headers}).then(C)},L=function(t,e){return fetch("".concat(y.baseUrl).concat(t),{method:"PATCH",headers:y.headers,body:JSON.stringify(e)}).then(C)},S=function(t){return fetch("".concat(y.baseUrl).concat(t),{method:"DELETE",headers:y.headers}).then(C)},k=function(t,e,n,o){var r=t.textContent;return o&&("string"!=typeof e&&(e="ошибка"),(e="Повторить ("+e+")").length>30&&(e=e.substring(0,25)+"...)")),t.textContent=e,n&&(t.classList.toggle(n),t.hasAttribute("disabled")?t.removeAttribute("disabled"):t.setAttribute("disabled","")),r},E=document.querySelector(".profile__info .profile__title"),q=document.querySelector(".profile__info .profile__description"),x=document.querySelector(".profile__image"),B=document.querySelector(".popup_type_edit"),A=document.querySelector(".popup_type_new-card"),N=document.querySelector(".popup_type_avatar"),T=document.querySelector(".popup_type_delete-card"),U=document.querySelector(".popup_type_image"),P=document.querySelector(".popup_type_image .popup__image"),w=document.querySelector(".popup_type_image .popup__caption"),I=document.forms["edit-profile"],D=document.forms["new-place"],j=document.forms["edit-avatar"],O=document.forms["delete-card"],J=document.querySelector("#card-template").content,M=document.querySelector(".places__list"),z=function(t){return t.querySelector(u.submitButtonSelector)},G=z(I),H=z(D),R=z(j),V=z(O),W=function(t,e,n,o){var r;o?(k(e,"⌛️",null),t.classList.contains(s)?(r=n._id,S("/cards/likes/".concat(r))).then((function(n){n.likes.some((function(t){return t._id===o}))||t.classList.remove(s),e.textContent=n.likes.length})).catch((function(t){console.log(t),e.textContent="?"})):function(t){return e="/cards/likes/".concat(t),fetch("".concat(y.baseUrl).concat(e),{method:"PUT",headers:y.headers}).then(C);var e}(n._id).then((function(n){n.likes.some((function(t){return t._id===o}))&&t.classList.add(s),e.textContent=n.likes.length})).catch((function(t){console.log(t),e.textContent="?"}))):e.textContent=n.likes.length},F=function(t,n,o,r){(e={}).cardElement=t,e.remove=n,e.handle=o,e.card=r},K=[{activator:"profile__edit-button",popup:B,form:I,setup:function(){I.elements.name.value=E.textContent,I.elements.description.value=q.textContent,b(I,u)},submit:function(t){t.preventDefault();var e,n=k(G,r,u.inactiveButtonClass);(e={name:I.elements.name.value,about:I.elements.description.value},L("/users/me",e)).then((function(t){E.textContent=t.name,q.textContent=t.about,p(B,Z),k(G,n,u.inactiveButtonClass),b(I,u)})).catch((function(t){k(G,t,u.inactiveButtonClass,!0)}))}},{activator:"profile__add-button",popup:A,form:D,setup:function(){D.reset(),b(D,u)},submit:function(e){e.preventDefault();var n,o,a=k(H,r,u.inactiveButtonClass);(n={name:D.elements["place-name"].value,link:D.elements.link.value},o=n,fetch("".concat(y.baseUrl).concat("/cards"),{method:"POST",headers:y.headers,body:JSON.stringify(o)}).then(C)).then((function(e){X(e,J,M,d,F,W,Q,t),p(A,Z),b(D,u),D.reset(),k(H,a,u.inactiveButtonClass)})).catch((function(t){k(H,t,u.inactiveButtonClass,!0)}))}},{activator:"profile__image",popup:N,form:j,setup:function(){j.reset(),b(j,u)},submit:function(t){t.preventDefault();var e,n=k(R,r,u.inactiveButtonClass);(e={avatar:j.elements.link.value},L("/users/me/avatar",e)).then((function(t){x.style.backgroundImage='url("'.concat(t.avatar,'")'),p(N,Z),j.reset(),k(R,n,u.inactiveButtonClass),b(j,u)})).catch((function(t){k(R,t,u.inactiveButtonClass,!0)}))}},{activator:"card__delete-button",popup:T,form:O,setup:function(){e=null},submit:function(t){t.preventDefault();var n,o=k(V,"Удаление...",u.inactiveButtonClass);e&&(n=e.card,S("/cards/".concat(n._id))).then((function(){e.remove(e.cardElement,e.handle),p(T,Z),e=null,k(V,o,u.inactiveButtonClass)})).catch((function(t){k(V,t,u.inactiveButtonClass,!0)}))}},{activator:"card__image",popup:U}],Q=function(t,e){var n,o,r;n=t,w.textContent=n.textContent,r=e,(o=P).src=r.src,o.alt=r.alt},X=function(t,e,n,o,r,a,c,i){n.prepend(o(t,e,r,a,c,i))},Y=function(){return K.find((function(t){return t.popup.classList.contains(o)}))},Z=function t(e){if("click"===e.type&&(e.target.classList.contains("popup")||e.target.classList.contains("popup__close"))||"Escape"===e.key){var n=Y();n.form&&n.setup(),n&&p(n.popup,t)}},$=function(t){var e,r,a,c=(e=t.target,K.find((function(t){return e.classList.contains(t.activator)||e===t.popup})));c&&!Y()&&(r=c.popup,a=Z,r.classList.contains(n)?r.classList.add(o):(setTimeout((function(){r.classList.add(n)}),0),setTimeout((function(){r.classList.add(o)}),10)),document.addEventListener("click",a),document.addEventListener("keydown",a))};Promise.all([g("/cards"),g("/users/me")]).then((function(e){var n,o,r,a,c,i,s,l,p,v=e[0];n=t=e[1],E.textContent=n.name,q.textContent=n.about,x.style.backgroundImage='url("'.concat(n.avatar,'")'),o=J,r=M,a=d,c=F,i=W,s=Q,l=t,v.forEach((function(t){X(t,o,r,a,c,i,s,l)})),document.addEventListener("click",$),K.forEach((function(t){t.form&&(t.setup(),t.form.addEventListener("submit",t.submit))})),p=u,Array.from(document.querySelectorAll(p.formSelector)).forEach((function(t){!function(t,e){var n=Array.from(t.elements),o=n.find((function(t){return"submit"===t.type}));n.forEach((function(r){if("INPUT"===r.nodeName){var a=f(t,r);r.addEventListener("input",(function(){var t,c;!function(t,e,n){h(t)?_(t,e,n):function(t,e,n){n.textContent=t.validationMessage,n.classList.add(e.errorClass),t.classList.add(e.inputErrorClass)}(t,e,n)}(r,e,a),n.every((function(t){return"INPUT"!==t.nodeName||h(t)}))?(t=o,c=e.inactiveButtonClass,t.hasAttribute("disabled")&&(t.removeAttribute("disabled"),t.classList.remove(c))):m(o,e.inactiveButtonClass)}))}}))}(t,p)}))})).catch((function(t){console.log(t)}))})();