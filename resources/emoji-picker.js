const EmojiPicker = function (options, callbackSetSelectorColor) {
    this.options = options;
    this.trigger = this.options.trigger.map(item => item.selector);
    this.insertInto = undefined;
    let emojiesHTML = '';
    let categoriesHTML = '';
    let emojiList = undefined;
    const pickerWidth = 330;
    const pickerHeight = 349;
    let elementTarget;
    let targetClass = "";
    const triangleWidth = 21;
    const moreDistanceY = 8;
    const moreDistanceX = 4;
    let pickerShowState = false;

    this.lib = function (el = undefined) {

        const isNodeList = (nodes) => {
            var stringRepr = Object.prototype.toString.call(nodes);

            return typeof nodes === 'object' &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
                (typeof nodes.length === 'number') &&
                (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
        }

        return {
            el: () => {
                // Check if is node
                if (!el) {
                    return undefined;
                } else if (el.nodeName) {
                    return [el];
                } else if (isNodeList(el)) {
                    return Array.from(el)
                } else if (typeof (el) === 'string' || typeof (el) === 'STRING') {
                    return Array.from(document.querySelectorAll(el));
                } else {
                    return undefined;
                }
            },

            on(event, callback, classList = undefined) {
                if (!classList) {
                    this.el().forEach(item => {
                        item.addEventListener(event, callback.bind(item))
                    })
                } else {
                    this.el().forEach(item => {
                        item.addEventListener(event, (e) => {
                            if (e.target.closest(classList)) {

                                let attr = undefined;

                                if (Array.isArray(classList)) {
                                    const stringifiedElem = e.target.outerHTML;
                                    const stringifiedParentElem = e.target.parentNode.outerHTML;
                                    let index = classList.findIndex(attr => stringifiedElem.includes(attr.slice(1)));
                                    elementTarget = e.target;
                                    if (index == -1) {
                                        index = classList.findIndex(attr => stringifiedParentElem.includes(attr.slice(1)));
                                        elementTarget = e.target.parentNode;
                                    }
                                    attr = classList[index];
                                    targetClass = attr;
                                }

                                callback(e, attr)
                            }
                        })
                    })
                }
            },

            css(params) {
                for (const key in params) {
                    if (Object.hasOwnProperty.call(params, key)) {
                        const cssVal = params[key];
                        this.el().forEach(el => el.style[key] = cssVal)
                    }
                }
            },

            attr(param1, param2 = undefined) {

                if (!param2) {
                    return this.el()[0].getAttribute(param1)
                }
                this.el().forEach(el => el.setAttribute(param1, param2))
            },

            removeAttr(param) {
                this.el().forEach(el => el.removeAttribute(param))
            },

            addClass(param) {
                this.el().forEach(el => el.classList.add(param))
            },

            removeClass(param) {
                this.el().forEach(el => el.classList.remove(param))
            },

            slug(str) {
                return str
                    .toLowerCase()
                    .replace(/[^\u00BF-\u1FFF\u2C00-\uD7FF\w]+|[\_]+/ig, '-')
                    .replace(/ +/g, '-')
                    ;
            },

            remove(param) {
                this.el().forEach(el => el.remove())
            },

            val(param = undefined) {
                let val;

                if (param === undefined) {
                    this.el().forEach(el => {
                        val = el.value;
                    })
                } else {
                    this.el().forEach(el => {
                        el.value = param;
                    })
                }

                return val;
            },

            text(msg = undefined) {
                if (msg === undefined) {
                    return el.innerText;
                } else {
                    this.el().forEach(el => {
                        el.innerText = msg;
                    })
                }
            },

            html(data = undefined) {
                if (data === undefined) {
                    return el.innerHTML;
                } else {
                    this.el().forEach(el => {
                        el.innerHTML = data;
                    })
                }
            }
        }
    };

    const emojiObj = {
        'smile-people': [ // Smile and people        
            { "emoji": "😀", "title": "grinning face" },
            { "emoji": "😃", "title": "grinning face with big eyes" },
            { "emoji": "😄", "title": "grinning face with smiling eyes" },
            { "emoji": "😁", "title": "beaming face with smiling eyes" },
            { "emoji": "😆", "title": "grinning squinting face" },
            { "emoji": "😅", "title": "grinning face with sweat" },
            { "emoji": "🤣", "title": "rolling on the floor laughing" },
            { "emoji": "😂", "title": "face with tears of joy" },
            { "emoji": "🙂", "title": "slightly smiling face" },
            { "emoji": "🙃", "title": "upside-down face" },
            { "emoji": "😉", "title": "winking face" },
            { "emoji": "😊", "title": "smiling face with smiling eyes" },
            { "emoji": "😇", "title": "smiling face with halo" },
            { "emoji": "🥰", "title": "smiling face with hearts" },
            { "emoji": "😍", "title": "smiling face with heart-eyes" },
            { "emoji": "🤩", "title": "star-struck" },
            { "emoji": "😘", "title": "face blowing a kiss" },
            { "emoji": "😗", "title": "kissing face" },
            { "emoji": "☺️", "title": "smiling face" },
            { "emoji": "😚", "title": "kissing face with closed eyes" },
            { "emoji": "😙", "title": "kissing face with smiling eyes" },
            { "emoji": "🥲", "title": "smiling face with tear" },
            { "emoji": "😋", "title": "face savoring food" },
            { "emoji": "😛", "title": "face with tongue" },
            { "emoji": "😜", "title": "winking face with tongue" },
            { "emoji": "🤪", "title": "zany face" },
            { "emoji": "😝", "title": "squinting face with tongue" },
            { "emoji": "🤑", "title": "money-mouth face" },
            { "emoji": "🤗", "title": "hugging face" },
            { "emoji": "🤭", "title": "face with hand over mouth" },
            { "emoji": "🤫", "title": "shushing face" },
            { "emoji": "🤔", "title": "thinking face" },
            { "emoji": "🤐", "title": "zipper-mouth face" },
            { "emoji": "🤨", "title": "face with raised eyebrow" },
            { "emoji": "😐", "title": "neutral face" },
            { "emoji": "😑", "title": "expressionless face" },
            { "emoji": "😶", "title": "face without mouth" },
            { "emoji": "😏", "title": "smirking face" },
            { "emoji": "😒", "title": "unamused face" },
            { "emoji": "🙄", "title": "face with rolling eyes" },
            { "emoji": "😬", "title": "grimacing face" },
            { "emoji": "🤥", "title": "lying face" },
            { "emoji": "😌", "title": "relieved face" },
            { "emoji": "😔", "title": "pensive face" },
            { "emoji": "😪", "title": "sleepy face" },
            { "emoji": "🤤", "title": "drooling face" },
            { "emoji": "😴", "title": "sleeping face" },
            { "emoji": "😷", "title": "face with medical mask" },
            { "emoji": "🤒", "title": "face with thermometer" },
            { "emoji": "🤕", "title": "face with head-bandage" },
            { "emoji": "🤢", "title": "nauseated face" },
            { "emoji": "🤮", "title": "face vomiting" },
            { "emoji": "🤧", "title": "sneezing face" },
            { "emoji": "🥵", "title": "hot face" },
            { "emoji": "🥶", "title": "cold face" },
            { "emoji": "🥴", "title": "woozy face" },
            { "emoji": "😵", "title": "dizzy face" },
            { "emoji": "🤯", "title": "exploding head" },
            { "emoji": "🤠", "title": "cowboy hat face" },
            { "emoji": "🥳", "title": "partying face" },
            { "emoji": "🥸", "title": "disguised face" },
            { "emoji": "😎", "title": "smiling face with sunglasses" },
            { "emoji": "🤓", "title": "nerd face" },
            { "emoji": "🧐", "title": "face with monocle" },
            { "emoji": "😕", "title": "confused face" },
            { "emoji": "😟", "title": "worried face" },
            { "emoji": "🙁", "title": "slightly frowning face" },
            { "emoji": "☹️", "title": "frowning face" },
            { "emoji": "😮", "title": "face with open mouth" },
            { "emoji": "😯", "title": "hushed face" },
            { "emoji": "😲", "title": "astonished face" },
            { "emoji": "😳", "title": "flushed face" },
            { "emoji": "🥺", "title": "pleading face" },
            { "emoji": "😦", "title": "frowning face with open mouth" },
            { "emoji": "😧", "title": "anguished face" },
            { "emoji": "😨", "title": "fearful face" },
            { "emoji": "😰", "title": "anxious face with sweat" },
            { "emoji": "😥", "title": "sad but relieved face" },
            { "emoji": "😢", "title": "crying face" },
            { "emoji": "😭", "title": "loudly crying face" },
            { "emoji": "😱", "title": "face screaming in fear" },
            { "emoji": "😖", "title": "confounded face" },
            { "emoji": "😣", "title": "persevering face" },
            { "emoji": "😞", "title": "disappointed face" },
            { "emoji": "😓", "title": "downcast face with sweat" },
            { "emoji": "😩", "title": "weary face" },
            { "emoji": "😫", "title": "tired face" },
            { "emoji": "🥱", "title": "yawning face" },
            { "emoji": "😤", "title": "face with steam from nose" },
            { "emoji": "😡", "title": "pouting face" },
            { "emoji": "😠", "title": "angry face" },
            { "emoji": "🤬", "title": "face with symbols on mouth" },
            { "emoji": "😈", "title": "smiling face with horns" },
            { "emoji": "👿", "title": "angry face with horns" },
            { "emoji": "💀", "title": "skull" },
            { "emoji": "☠️", "title": "skull and crossbones" },
            { "emoji": "💩", "title": "pile of poo" },
            { "emoji": "🤡", "title": "clown face" },
            { "emoji": "👹", "title": "ogre" },
            { "emoji": "👺", "title": "goblin" },
            { "emoji": "👻", "title": "ghost" },
            { "emoji": "👽", "title": "alien" },
            { "emoji": "👾", "title": "alien monster" },
            { "emoji": "🤖", "title": "robot" },
            { "emoji": "🎃", "title": "jack-o-lantern" },
            { "emoji": "😺", "title": "grinning cat" },
            { "emoji": "😸", "title": "grinning cat with smiling eyes" },
            { "emoji": "😹", "title": "cat with tears of joy" },
            { "emoji": "😻", "title": "smiling cat with heart-eyes" },
            { "emoji": "😼", "title": "cat with wry smile" },
            { "emoji": "😽", "title": "kissing cat" },
            { "emoji": "🙀", "title": "weary cat" },
            { "emoji": "😿", "title": "crying cat" },
            { "emoji": "😾", "title": "pouting cat" },
            { "emoji": "🤲", "title": "palms up together" },
            { "emoji": "👐", "title": "open hands" },
            { "emoji": "🙌", "title": "raising hands" },
            { "emoji": "👏", "title": "clapping hands" },
            { "emoji": "🤝", "title": "handshake" },
            { "emoji": "👍", "title": "thumbs up" },
            { "emoji": "👎", "title": "thumbs down" },
            { "emoji": "👊", "title": "oncoming fist" },
            { "emoji": "✊", "title": "raised fist" },
            { "emoji": "🤛", "title": "left-facing fist" },
            { "emoji": "🤜", "title": "right-facing fist" },
            { "emoji": "🤞", "title": "crossed fingers" },
            { "emoji": "✌️", "title": "victory hand" },
            { "emoji": "🤟", "title": "love-you gesture" },
            { "emoji": "🤘", "title": "sign of the horns" },
            { "emoji": "👌", "title": "OK hand" },
            { "emoji": "🤌", "title": "pinched fingers" },
            { "emoji": "🤏", "title": "pinching hand" },
            { "emoji": "👈", "title": "backhand index pointing left" },
            { "emoji": "👉", "title": "backhand index pointing right" },
            { "emoji": "👆", "title": "backhand index pointing up" },
            { "emoji": "👇", "title": "backhand index pointing down" },
            { "emoji": "☝️", "title": "index pointing up" },
            { "emoji": "✋", "title": "raised hand" },
            { "emoji": "🤚", "title": "raised back of hand" },
            { "emoji": "🖐️", "title": "hand with fingers splayed" },
            { "emoji": "🖖", "title": "vulcan salute" },
            { "emoji": "👋", "title": "waving hand" },
            { "emoji": "🤙", "title": "call me hand" },
            { "emoji": "💪", "title": "flexed biceps" },
            { "emoji": "🦾", "title": "mechanical arm" },
            { "emoji": "🖕", "title": "middle finger" },
            { "emoji": "✍️", "title": "writing hand" },
            { "emoji": "🙏", "title": "folded hands" },
            { "emoji": "🦶", "title": "foot" },
            { "emoji": "🦵", "title": "leg" },
            { "emoji": "🦿", "title": "mechanical leg" },
            { "emoji": "💄", "title": "lipstick" },
            { "emoji": "💋", "title": "kiss mark" },
            { "emoji": "👄", "title": "mouth" },
            { "emoji": "🫦", "title": "biting lip" },
            { "emoji": "🦷", "title": "tooth" },
            { "emoji": "👅", "title": "tongue" },
            { "emoji": "👂", "title": "ear" },
            { "emoji": "🦻", "title": "ear with hearing aid" },
            { "emoji": "👃", "title": "nose" },
            { "emoji": "👣", "title": "footprints" },
            { "emoji": "👁️", "title": "eye" },
            { "emoji": "👀", "title": "eyes" },
            { "emoji": "🫀", "title": "anatomical heart" },
            { "emoji": "🫁", "title": "lungs" },
            { "emoji": "🧠", "title": "brain" },
            { "emoji": "🗣️", "title": "speaking head" },
            { "emoji": "👤", "title": "bust in silhouette" },
            { "emoji": "👥", "title": "busts in silhouette" },
            { "emoji": "🫂", "title": "people hugging" },
            { "emoji": "👶", "title": "baby" },
            { "emoji": "👧", "title": "girl" },
            { "emoji": "🧒", "title": "child" },
            { "emoji": "👦", "title": "boy" },
            { "emoji": "👩", "title": "woman" },
            { "emoji": "🧑", "title": "person" },
            { "emoji": "👨", "title": "man" },
            { "emoji": "👩‍🦱", "title": "woman: curly hair" },
            { "emoji": "🧑‍🦱", "title": "person: curly hair" },
            { "emoji": "👨‍🦱", "title": "man: curly hair" },
            { "emoji": "👩‍🦰", "title": "woman: red hair" },
            { "emoji": "🧑‍🦰", "title": "person: red hair" },
            { "emoji": "👨‍🦰", "title": "man: red hair" },
            { "emoji": "👱‍♀️", "title": "woman: blond hair" },
            { "emoji": "👱", "title": "person: blond hair" },
            { "emoji": "👱‍♂️", "title": "man: blond hair" },
            { "emoji": "👩‍🦳", "title": "woman: white hair" },
            { "emoji": "🧑‍🦳", "title": "person: white hair" },
            { "emoji": "👨‍🦳", "title": "man: white hair" },
            { "emoji": "👩‍🦲", "title": "woman: bald" },
            { "emoji": "🧑‍🦲", "title": "person: bald" },
            { "emoji": "👨‍🦲", "title": "man: bald" },
            { "emoji": "🧔", "title": "man: beard" },
            { "emoji": "👵", "title": "old woman" },
            { "emoji": "🧓", "title": "older person" },
            { "emoji": "👴", "title": "old man" },
            { "emoji": "👲", "title": "person with skullcap" },
            { "emoji": "👳‍♀️", "title": "woman wearing turban" },
            { "emoji": "👳", "title": "person wearing turban" },
            { "emoji": "👳‍♂️", "title": "man wearing turban" },
            { "emoji": "🧕", "title": "woman with headscarf" },
            { "emoji": "👮‍♀️", "title": "woman police officer" },
            { "emoji": "👮", "title": "police officer" },
            { "emoji": "👮‍♂️", "title": "man police officer" },
            { "emoji": "👷‍♀️", "title": "woman construction worker" },
            { "emoji": "👷", "title": "construction worker" },
            { "emoji": "👷‍♂️", "title": "man construction worker" },
            { "emoji": "💂‍♀️", "title": "woman guard" },
            { "emoji": "💂", "title": "guard" },
            { "emoji": "💂‍♂️", "title": "man guard" },
            { "emoji": "🕵️‍♀️", "title": "woman detective" },
            { "emoji": "🕵️", "title": "detective" },
            { "emoji": "🕵️‍♂️", "title": "man detective" },
            { "emoji": "👩‍⚕️", "title": "woman health worker" },
            { "emoji": "🧑‍⚕️", "title": "health worker" },
            { "emoji": "👨‍⚕️", "title": "man health worker" },
            { "emoji": "👩‍🌾", "title": "woman farmer" },
            { "emoji": "🧑‍🌾", "title": "farmer" },
            { "emoji": "👨‍🌾", "title": "man farmer" },
            { "emoji": "👩‍🍳", "title": "woman cook" },
            { "emoji": "🧑‍🍳", "title": "cook" },
            { "emoji": "👨‍🍳", "title": "man cook" },
            { "emoji": "👩‍🎓", "title": "woman student" },
            { "emoji": "🧑‍🎓", "title": "student" },
            { "emoji": "👨‍🎓", "title": "man student" },
            { "emoji": "👩‍🎤", "title": "woman singer" },
            { "emoji": "🧑‍🎤", "title": "singer" },
            { "emoji": "👨‍🎤", "title": "man singer" },
            { "emoji": "👩‍🏫", "title": "woman teacher" },
            { "emoji": "🧑‍🏫", "title": "teacher" },
            { "emoji": "👨‍🏫", "title": "man teacher" },
            { "emoji": "👩‍🏭", "title": "woman factory worker" },
            { "emoji": "🧑‍🏭", "title": "factory worker" },
            { "emoji": "👨‍🏭", "title": "man factory worker" },
            { "emoji": "👩‍💻", "title": "woman technologist" },
            { "emoji": "🧑‍💻", "title": "technologist" },
            { "emoji": "👨‍💻", "title": "man technologist" },
            { "emoji": "👩‍💼", "title": "woman office worker" },
            { "emoji": "🧑‍💼", "title": "office worker" },
            { "emoji": "👨‍💼", "title": "man office worker" },
            { "emoji": "👩‍🔧", "title": "woman mechanic" },
            { "emoji": "🧑‍🔧", "title": "mechanic" },
            { "emoji": "👨‍🔧", "title": "man mechanic" },
            { "emoji": "👩‍🔬", "title": "woman scientist" },
            { "emoji": "🧑‍🔬", "title": "scientist" },
            { "emoji": "👨‍🔬", "title": "man scientist" },
            { "emoji": "👩‍🎨", "title": "woman artist" },
            { "emoji": "🧑‍🎨", "title": "artist" },
            { "emoji": "👨‍🎨", "title": "man artist" },
            { "emoji": "👩‍🚒", "title": "woman firefighter" },
            { "emoji": "🧑‍🚒", "title": "firefighter" },
            { "emoji": "👨‍🚒", "title": "man firefighter" },
            { "emoji": "👩‍✈️", "title": "woman pilot" },
            { "emoji": "🧑‍✈️", "title": "pilot" },
            { "emoji": "👨‍✈️", "title": "man pilot" },
            { "emoji": "👩‍🚀", "title": "woman astronaut" },
            { "emoji": "🧑‍🚀", "title": "astronaut" },
            { "emoji": "👨‍🚀", "title": "man astronaut" },
            { "emoji": "👩‍⚖️", "title": "woman judge" },
            { "emoji": "🧑‍⚖️", "title": "judge" },
            { "emoji": "👨‍⚖️", "title": "man judge" },
            { "emoji": "👰‍♀️", "title": "woman with veil" },
            { "emoji": "👰", "title": "person with veil" },
            { "emoji": "👰‍♂️", "title": "man with veil" },
            { "emoji": "🤵‍♀️", "title": "woman in tuxedo" },
            { "emoji": "🤵", "title": "person in tuxedo" },
            { "emoji": "🤵‍♂️", "title": "man in tuxedo" },
            { "emoji": "👸", "title": "princess" },
            { "emoji": "🤴", "title": "prince" },
            { "emoji": "🥷", "title": "ninja" },
            { "emoji": "🦸‍♀️", "title": "woman superhero" },
            { "emoji": "🦸", "title": "superhero" },
            { "emoji": "🦸‍♂️", "title": "man superhero" },
            { "emoji": "🦹‍♀️", "title": "woman supervillain" },
            { "emoji": "🦹", "title": "supervillain" },
            { "emoji": "🦹‍♂️", "title": "man supervillain" },
            { "emoji": "🤶", "title": "Mrs. Claus" },
            { "emoji": "🧑‍🎄", "title": "mx claus" },
            { "emoji": "🎅", "title": "Santa Claus" },
            { "emoji": "🧙‍♀️", "title": "woman mage" },
            { "emoji": "🧙", "title": "mage" },
            { "emoji": "🧙‍♂️", "title": "man mage" },
            { "emoji": "🧝", "title": "elf" },
            { "emoji": "🧝‍♂️", "title": "man elf" },
            { "emoji": "🧝‍♀️", "title": "woman elf" },
            { "emoji": "🧌", "title": "troll" },
            { "emoji": "🧛‍♀️", "title": "woman vampire" },
            { "emoji": "🧛", "title": "vampire" },
            { "emoji": "🧛‍♂️", "title": "man vampire" },
            { "emoji": "🧟‍♀️", "title": "woman zombie" },
            { "emoji": "🧟", "title": "zombie" },
            { "emoji": "🧟‍♂️", "title": "man zombie" },
            { "emoji": "🧞‍♀️", "title": "woman genie" },
            { "emoji": "🧞", "title": "genie" },
            { "emoji": "🧞‍♂️", "title": "man genie" },
            { "emoji": "🧜‍♀️", "title": "mermaid" },
            { "emoji": "🧜", "title": "merperson" },
            { "emoji": "🧜‍♂️", "title": "merman" },
            { "emoji": "🧚‍♀️", "title": "woman fairy" },
            { "emoji": "🧚", "title": "fairy" },
            { "emoji": "🧚‍♂️", "title": "man fairy" },
            { "emoji": "👼", "title": "baby angel" },
            { "emoji": "🤰", "title": "pregnant woman" },
            { "emoji": "🫄", "title": "pregnant person" },
            { "emoji": "🫃", "title": "pregnant man" },
            { "emoji": "🤱", "title": "breast-feeding" },
            { "emoji": "👩‍🍼", "title": "woman feeding baby" },
            { "emoji": "🧑‍🍼", "title": "person feeding baby" },
            { "emoji": "👨‍🍼", "title": "man feeding baby" },
            { "emoji": "🙇‍♀️", "title": "woman bowing" },
            { "emoji": "🙇", "title": "person bowing" },
            { "emoji": "🙇‍♂️", "title": "man bowing" },
            { "emoji": "💁‍♀️", "title": "woman tipping hand" },
            { "emoji": "💁", "title": "person tipping hand" },
            { "emoji": "💁‍♂️", "title": "man tipping hand" },
            { "emoji": "🙆‍♀️", "title": "woman gesturing OK" },
            { "emoji": "🙆", "title": "person gesturing OK" },
            { "emoji": "🙆‍♂️", "title": "man gesturing OK" },
            { "emoji": "🙅‍♀️", "title": "woman gesturing NO" },
            { "emoji": "🙅", "title": "person gesturing NO" },
            { "emoji": "🙅‍♂️", "title": "man gesturing NO" },
            { "emoji": "🙋‍♀️", "title": "woman raising hand" },
            { "emoji": "🙋", "title": "person raising hand" },
            { "emoji": "🙋‍♂️", "title": "man raising hand" },
            { "emoji": "🧏‍♀️", "title": "deaf woman" },
            { "emoji": "🧏", "title": "deaf person" },
            { "emoji": "🧏‍♂️", "title": "deaf man" },
            { "emoji": "🤦‍♀️", "title": "woman facepalming" },
            { "emoji": "🤦", "title": "person facepalming" },
            { "emoji": "🤦‍♂️", "title": "man facepalming" },
            { "emoji": "🤷‍♀️", "title": "woman shrugging" },
            { "emoji": "🤷", "title": "person shrugging" },
            { "emoji": "🤷‍♂️", "title": "man shrugging" },
            { "emoji": "🙍‍♀️", "title": "woman frowning" },
            { "emoji": "🙍", "title": "person frowning" },
            { "emoji": "🙍‍♂️", "title": "man frowning" },
            { "emoji": "🙎‍♀️", "title": "woman pouting" },
            { "emoji": "🙎", "title": "person pouting" },
            { "emoji": "🙎‍♂️", "title": "man pouting" },
            { "emoji": "💇‍♀️", "title": "woman getting haircut" },
            { "emoji": "💇", "title": "person getting haircut" },
            { "emoji": "💇‍♂️", "title": "man getting haircut" },
            { "emoji": "💆‍♀️", "title": "woman getting massage" },
            { "emoji": "💆", "title": "person getting massage" },
            { "emoji": "💆‍♂️", "title": "man getting massage" },
            { "emoji": "🧖‍♀️", "title": "woman in steamy room" },
            { "emoji": "🧖", "title": "person in steamy room" },
            { "emoji": "🧖‍♂️", "title": "man in steamy room" },
            { "emoji": "💅", "title": "nail polish" },
            { "emoji": "🤳", "title": "selfie" },
            { "emoji": "💃", "title": "woman dancing" },
            { "emoji": "🕺", "title": "man dancing" },
            { "emoji": "👯‍♀️", "title": "women with bunny ears" },
            { "emoji": "👯", "title": "people with bunny ears" },
            { "emoji": "👯‍♂️", "title": "men with bunny ears" },
            { "emoji": "🕴️", "title": "person in suit levitating" },
            { "emoji": "👩‍🦽", "title": "woman in manual wheelchair" },
            { "emoji": "🧑‍🦽", "title": "person in manual wheelchair" },
            { "emoji": "👨‍🦽", "title": "man in manual wheelchair" },
            { "emoji": "👩‍🦼", "title": "woman in motorized wheelchair" },
            { "emoji": "🧑‍🦼", "title": "person in motorized wheelchair" },
            { "emoji": "👨‍🦼", "title": "man in motorized wheelchair" },
            { "emoji": "🚶‍♀️", "title": "woman walking" },
            { "emoji": "🚶", "title": "person walking" },
            { "emoji": "🚶‍♂️", "title": "man walking" },
            { "emoji": "👩‍🦯", "title": "woman with white cane" },
            { "emoji": "🧑‍🦯", "title": "person with white cane" },
            { "emoji": "👨‍🦯", "title": "man with white cane" },
            { "emoji": "🧎‍♀️", "title": "woman kneeling" },
            { "emoji": "🧎", "title": "person kneeling" },
            { "emoji": "🧎‍♂️", "title": "man kneeling" },
            { "emoji": "🏃‍♀️", "title": "woman running" },
            { "emoji": "🏃", "title": "person running" },
            { "emoji": "🏃‍♂️", "title": "man running" },
            { "emoji": "🧍‍♀️", "title": "woman standing" },
            { "emoji": "🧍", "title": "person standing" },
            { "emoji": "🧍‍♂️", "title": "man standing" },
            { "emoji": "👫", "title": "woman and man holding hands" },
            { "emoji": "👭", "title": "women holding hands" },
            { "emoji": "👬", "title": "men holding hands" },
            { "emoji": "💑", "title": "couple with heart" },
            { "emoji": "👩‍❤️‍👩", "title": "couple with heart: woman, woman" },
            { "emoji": "👩‍❤️‍👨", "title": "couple with heart: woman, man" },
            { "emoji": "👨‍❤️‍👨", "title": "couple with heart: man, man" },
            { "emoji": "💏", "title": "kiss" },
            { "emoji": "👩‍❤️‍💋‍👩", "title": "kiss: woman, woman" },
            { "emoji": "👩‍❤️‍💋‍👨", "title": "kiss: woman, man" },
            { "emoji": "👨‍❤️‍💋‍👨", "title": "kiss: man, man" },
            { "emoji": "👪", "title": "family" },
            { "emoji": "👨‍👩‍👦", "title": "family: man, woman, boy" },
            { "emoji": "👨‍👩‍👧", "title": "family: man, woman, girl" },
            { "emoji": "👨‍👩‍👧‍👦", "title": "family: man, woman, girl, boy" },
            { "emoji": "👨‍👩‍👦‍👦", "title": "family: man, woman, boy, boy" },
            { "emoji": "👨‍👩‍👧‍👧", "title": "family: man, woman, girl, girl" },
            { "emoji": "👩‍👩‍👦", "title": "family: woman, woman, boy" },
            { "emoji": "👩‍👩‍👧", "title": "family: woman, woman, girl" },
            { "emoji": "👩‍👩‍👧‍👦", "title": "family: woman, woman, girl, boy" },
            { "emoji": "👩‍👩‍👦‍👦", "title": "family: woman, woman, boy, boy" },
            { "emoji": "👩‍👩‍👧‍👧", "title": "family: woman, woman, girl, girl" },
            { "emoji": "👨‍👨‍👦", "title": "family: man, man, boy" },
            { "emoji": "👨‍👨‍👧", "title": "family: man, man, girl" },
            { "emoji": "👨‍👨‍👧‍👦", "title": "family: man, man, girl, boy" },
            { "emoji": "👨‍👨‍👦‍👦", "title": "family: man, man, boy, boy" },
            { "emoji": "👨‍👨‍👧‍👧", "title": "family: man, man, girl, girl" },
            { "emoji": "👩‍👦", "title": "family: woman, boy" },
            { "emoji": "👩‍👧", "title": "family: woman, girl" },
            { "emoji": "👩‍👧‍👦", "title": "family: woman, girl, boy" },
            { "emoji": "👩‍👦‍👦", "title": "family: woman, boy, boy" },
            { "emoji": "👩‍👧‍👧", "title": "family: woman, girl, girl" },
            { "emoji": "👨‍👦", "title": "family: man, boy" },
            { "emoji": "👨‍👧", "title": "family: man, girl" },
            { "emoji": "👨‍👧‍👦", "title": "family: man, girl, boy" },
            { "emoji": "👨‍👦‍👦", "title": "family: man, boy, boy" },
            { "emoji": "👨‍👧‍👧", "title": "family: man, girl, girl" },
            { "emoji": "🪢", "title": "knot" },
            { "emoji": "🧶", "title": "yarn" },
            { "emoji": "🧵", "title": "thread" },
            { "emoji": "🪡", "title": "sewing needle" },
            { "emoji": "🧥", "title": "coat" },
            { "emoji": "🥼", "title": "lab coat" },
            { "emoji": "🦺", "title": "safety vest" },
            { "emoji": "👚", "title": "woman’s clothes" },
            { "emoji": "👕", "title": "t-shirt" },
            { "emoji": "👖", "title": "jeans" },
            { "emoji": "🩲", "title": "briefs" },
            { "emoji": "🩳", "title": "shorts" },
            { "emoji": "👔", "title": "necktie" },
            { "emoji": "👗", "title": "dress" },
            { "emoji": "👙", "title": "bikini" },
            { "emoji": "🩱", "title": "one-piece swimsuit" },
            { "emoji": "👘", "title": "kimono" },
            { "emoji": "🥻", "title": "sari" },
            { "emoji": "🩴", "title": "thong sandal" },
            { "emoji": "🥿", "title": "flat shoe" },
            { "emoji": "👠", "title": "high-heeled shoe" },
            { "emoji": "👡", "title": "woman’s sandal" },
            { "emoji": "👢", "title": "woman’s boot" },
            { "emoji": "👞", "title": "man’s shoe" },
            { "emoji": "👟", "title": "running shoe" },
            { "emoji": "🥾", "title": "hiking boot" },
            { "emoji": "🧦", "title": "socks" },
            { "emoji": "🧤", "title": "gloves" },
            { "emoji": "🧣", "title": "scarf" },
            { "emoji": "🎩", "title": "top hat" },
            { "emoji": "🧢", "title": "billed cap" },
            { "emoji": "👒", "title": "woman’s hat" },
            { "emoji": "🎓", "title": "graduation cap" },
            { "emoji": "⛑️", "title": "rescue worker’s helmet" },
            { "emoji": "🪖", "title": "military helmet" },
            { "emoji": "👑", "title": "crown" },
            { "emoji": "💍", "title": "ring" },
            { "emoji": "👝", "title": "clutch bag" },
            { "emoji": "👛", "title": "purse" },
            { "emoji": "👜", "title": "handbag" },
            { "emoji": "💼", "title": "briefcase" },
            { "emoji": "🎒", "title": "backpack" },
            { "emoji": "🧳", "title": "luggage" },
            { "emoji": "👓", "title": "glasses" },
            { "emoji": "🕶️", "title": "sunglasses" },
            { "emoji": "🥽", "title": "goggles" },
            { "emoji": "🌂", "title": "closed umbrella" }
        ],
        'animal-nature': [ // Animal and nature
            { "emoji": "🐶", "title": "dog face" },
            { "emoji": "🐱", "title": "cat face" },
            { "emoji": "🐭", "title": "mouse face" },
            { "emoji": "🐹", "title": "hamster" },
            { "emoji": "🐰", "title": "rabbit face" },
            { "emoji": "🦊", "title": "fox" },
            { "emoji": "🐻", "title": "bear" },
            { "emoji": "🐼", "title": "panda" },
            { "emoji": "🐻‍❄️", "title": "polar bear" },
            { "emoji": "🐨", "title": "koala" },
            { "emoji": "🐯", "title": "tiger face" },
            { "emoji": "🦁", "title": "lion" },
            { "emoji": "🐮", "title": "cow face" },
            { "emoji": "🐷", "title": "pig face" },
            { "emoji": "🐽", "title": "pig nose" },
            { "emoji": "🐸", "title": "frog" },
            { "emoji": "🐵", "title": "monkey face" },
            { "emoji": "🙈", "title": "see-no-evil monkey" },
            { "emoji": "🙉", "title": "hear-no-evil monkey" },
            { "emoji": "🙊", "title": "speak-no-evil monkey" },
            { "emoji": "🐒", "title": "monkey" },
            { "emoji": "🐔", "title": "chicken" },
            { "emoji": "🐧", "title": "penguin" },
            { "emoji": "🐦", "title": "bird" },
            { "emoji": "🐤", "title": "baby chick" },
            { "emoji": "🐣", "title": "hatching chick" },
            { "emoji": "🐥", "title": "front-facing baby chick" },
            { "emoji": "🦆", "title": "duck" },
            { "emoji": "🦅", "title": "eagle" },
            { "emoji": "🦉", "title": "owl" },
            { "emoji": "🦇", "title": "bat" },
            { "emoji": "🐺", "title": "wolf" },
            { "emoji": "🐗", "title": "boar" },
            { "emoji": "🐴", "title": "horse face" },
            { "emoji": "🦄", "title": "unicorn" },
            { "emoji": "🐝", "title": "honeybee" },
            { "emoji": "🪱", "title": "worm" },
            { "emoji": "🐛", "title": "bug" },
            { "emoji": "🦋", "title": "butterfly" },
            { "emoji": "🐌", "title": "snail" },
            { "emoji": "🐞", "title": "lady beetle" },
            { "emoji": "🐜", "title": "ant" },
            { "emoji": "🪰", "title": "fly" },
            { "emoji": "🪲", "title": "beetle" },
            { "emoji": "🪳", "title": "cockroach" },
            { "emoji": "🦟", "title": "mosquito" },
            { "emoji": "🦗", "title": "cricket" },
            { "emoji": "🕷️", "title": "spider" },
            { "emoji": "🕸️", "title": "spider web" },
            { "emoji": "🦂", "title": "scorpion" },
            { "emoji": "🐢", "title": "turtle" },
            { "emoji": "🐍", "title": "snake" },
            { "emoji": "🦎", "title": "lizard" },
            { "emoji": "🦖", "title": "T-Rex" },
            { "emoji": "🦕", "title": "sauropod" },
            { "emoji": "🐙", "title": "octopus" },
            { "emoji": "🦑", "title": "squid" },
            { "emoji": "🦐", "title": "shrimp" },
            { "emoji": "🦞", "title": "lobster" },
            { "emoji": "🦀", "title": "crab" },
            { "emoji": "🐡", "title": "blowfish" },
            { "emoji": "🐠", "title": "tropical fish" },
            { "emoji": "🐟", "title": "fish" },
            { "emoji": "🐬", "title": "dolphin" },
            { "emoji": "🐳", "title": "spouting whale" },
            { "emoji": "🐋", "title": "whale" },
            { "emoji": "🦈", "title": "shark" },
            { "emoji": "🦭", "title": "seal" },
            { "emoji": "🐊", "title": "crocodile" },
            { "emoji": "🐅", "title": "tiger" },
            { "emoji": "🐆", "title": "leopard" },
            { "emoji": "🦓", "title": "zebra" },
            { "emoji": "🦍", "title": "gorilla" },
            { "emoji": "🦧", "title": "orangutan" },
            { "emoji": "🦣", "title": "mammoth" },
            { "emoji": "🐘", "title": "elephant" },
            { "emoji": "🦛", "title": "hippopotamus" },
            { "emoji": "🦏", "title": "rhinoceros" },
            { "emoji": "🐪", "title": "camel" },
            { "emoji": "🐫", "title": "two-hump camel" },
            { "emoji": "🦒", "title": "giraffe" },
            { "emoji": "🦘", "title": "kangaroo" },
            { "emoji": "🦬", "title": "bison" },
            { "emoji": "🐃", "title": "water buffalo" },
            { "emoji": "🐂", "title": "ox" },
            { "emoji": "🐄", "title": "cow" },
            { "emoji": "🐎", "title": "horse" },
            { "emoji": "🐖", "title": "pig" },
            { "emoji": "🐏", "title": "ram" },
            { "emoji": "🐑", "title": "ewe" },
            { "emoji": "🦙", "title": "llama" },
            { "emoji": "🐐", "title": "goat" },
            { "emoji": "🦌", "title": "deer" },
            { "emoji": "🐕", "title": "dog" },
            { "emoji": "🐩", "title": "poodle" },
            { "emoji": "🦮", "title": "guide dog" },
            { "emoji": "🐕‍🦺", "title": "service dog" },
            { "emoji": "🐈", "title": "cat" },
            { "emoji": "🐈‍⬛", "title": "black cat" },
            { "emoji": "🪶", "title": "feather" },
            { "emoji": "🐓", "title": "rooster" },
            { "emoji": "🦃", "title": "turkey" },
            { "emoji": "🦤", "title": "dodo" },
            { "emoji": "🦚", "title": "peacock" },
            { "emoji": "🦜", "title": "parrot" },
            { "emoji": "🦢", "title": "swan" },
            { "emoji": "🦩", "title": "flamingo" },
            { "emoji": "🕊️", "title": "dove" },
            { "emoji": "🐇", "title": "rabbit" },
            { "emoji": "🦝", "title": "raccoon" },
            { "emoji": "🦨", "title": "skunk" },
            { "emoji": "🦡", "title": "badger" },
            { "emoji": "🦫", "title": "beaver" },
            { "emoji": "🦦", "title": "otter" },
            { "emoji": "🦥", "title": "sloth" },
            { "emoji": "🐁", "title": "mouse" },
            { "emoji": "🐀", "title": "rat" },
            { "emoji": "🐿️", "title": "chipmunk" },
            { "emoji": "🦔", "title": "hedgehog" },
            { "emoji": "🐾", "title": "paw prints" },
            { "emoji": "🐉", "title": "dragon" },
            { "emoji": "🐲", "title": "dragon face" },
            { "emoji": "🌵", "title": "cactus" },
            { "emoji": "🎄", "title": "Christmas tree" },
            { "emoji": "🌲", "title": "evergreen tree" },
            { "emoji": "🌳", "title": "deciduous tree" },
            { "emoji": "🌴", "title": "palm tree" },
            { "emoji": "🪵", "title": "wood" },
            { "emoji": "🌱", "title": "seedling" },
            { "emoji": "🌿", "title": "herb" },
            { "emoji": "☘️", "title": "shamrock" },
            { "emoji": "🍀", "title": "four leaf clover" },
            { "emoji": "🎍", "title": "pine decoration" },
            { "emoji": "🪴", "title": "potted plant" },
            { "emoji": "🎋", "title": "tanabata tree" },
            { "emoji": "🍃", "title": "leaf fluttering in wind" },
            { "emoji": "🍂", "title": "fallen leaf" },
            { "emoji": "🍁", "title": "maple leaf" },
            { "emoji": "🪺", "title": "nest with eggs" },
            { "emoji": "🪹", "title": "empty nest" },
            { "emoji": "🍄", "title": "mushroom" },
            { "emoji": "🐚", "title": "spiral shell" },
            { "emoji": "🪸", "title": "coral" },
            { "emoji": "🪨", "title": "rock" },
            { "emoji": "🌾", "title": "sheaf of rice" },
            { "emoji": "💐", "title": "bouquet" },
            { "emoji": "🌷", "title": "tulip" },
            { "emoji": "🌹", "title": "rose" },
            { "emoji": "🥀", "title": "wilted flower" },
            { "emoji": "🪷", "title": "lotus" },
            { "emoji": "🌺", "title": "hibiscus" },
            { "emoji": "🌸", "title": "cherry blossom" },
            { "emoji": "🌼", "title": "blossom" },
            { "emoji": "🌻", "title": "sunflower" },
            { "emoji": "🌞", "title": "sun with face" },
            { "emoji": "🌝", "title": "full moon face" },
            { "emoji": "🌛", "title": "first quarter moon face" },
            { "emoji": "🌜", "title": "last quarter moon face" },
            { "emoji": "🌚", "title": "new moon face" },
            { "emoji": "🌕", "title": "full moon" },
            { "emoji": "🌖", "title": "waning gibbous moon" },
            { "emoji": "🌗", "title": "last quarter moon" },
            { "emoji": "🌘", "title": "waning crescent moon" },
            { "emoji": "🌑", "title": "new moon" },
            { "emoji": "🌒", "title": "waxing crescent moon" },
            { "emoji": "🌓", "title": "first quarter moon" },
            { "emoji": "🌔", "title": "waxing gibbous moon" },
            { "emoji": "🌙", "title": "crescent moon" },
            { "emoji": "🌎", "title": "globe showing Americas" },
            { "emoji": "🌍", "title": "globe showing Europe-Africa" },
            { "emoji": "🌏", "title": "globe showing Asia-Australia" },
            { "emoji": "🪐", "title": "ringed planet" },
            { "emoji": "💫", "title": "dizzy" },
            { "emoji": "⭐", "title": "star" },
            { "emoji": "🌟", "title": "glowing star" },
            { "emoji": "✨", "title": "sparkles" },
            { "emoji": "⚡", "title": "high voltage" },
            { "emoji": "☄️", "title": "comet" },
            { "emoji": "💥", "title": "collision" },
            { "emoji": "🔥", "title": "fire" },
            { "emoji": "🌪️", "title": "tornado" },
            { "emoji": "🌈", "title": "rainbow" },
            { "emoji": "☀️", "title": "sun" },
            { "emoji": "🌤️", "title": "sun behind small cloud" },
            { "emoji": "⛅", "title": "sun behind cloud" },
            { "emoji": "🌥️", "title": "sun behind large cloud" },
            { "emoji": "☁️", "title": "cloud" },
            { "emoji": "🌦️", "title": "sun behind rain cloud" },
            { "emoji": "🌧️", "title": "cloud with rain" },
            { "emoji": "⛈️", "title": "cloud with lightning and rain" },
            { "emoji": "🌩️", "title": "cloud with lightning" },
            { "emoji": "🌨️", "title": "cloud with snow" },
            { "emoji": "❄️", "title": "snowflake" },
            { "emoji": "☃️", "title": "snowman" },
            { "emoji": "⛄", "title": "snowman without snow" },
            { "emoji": "🌬️", "title": "wind face" },
            { "emoji": "💨", "title": "dashing away" },
            { "emoji": "💧", "title": "droplet" },
            { "emoji": "💦", "title": "sweat droplets" },
            { "emoji": "🫧", "title": "bubbles" },
            { "emoji": "☔", "title": "umbrella with rain drops" },
            { "emoji": "☂️", "title": "umbrella" },
            { "emoji": "🌊", "title": "water wave" },
            { "emoji": "🌫️", "title": "fog" }
        ],
        'food-drink': [ // Food and drink
            { "emoji": "🍏", "title": "green apple" },
            { "emoji": "🍎", "title": "red apple" },
            { "emoji": "🍐", "title": "pear" },
            { "emoji": "🍊", "title": "tangerine" },
            { "emoji": "🍋", "title": "lemon" },
            { "emoji": "🍌", "title": "banana" },
            { "emoji": "🍉", "title": "watermelon" },
            { "emoji": "🍇", "title": "grapes" },
            { "emoji": "🍓", "title": "strawberry" },
            { "emoji": "🫐", "title": "blueberries" },
            { "emoji": "🍈", "title": "melon" },
            { "emoji": "🍒", "title": "cherries" },
            { "emoji": "🍑", "title": "peach" },
            { "emoji": "🥭", "title": "mango" },
            { "emoji": "🍍", "title": "pineapple" },
            { "emoji": "🥥", "title": "coconut" },
            { "emoji": "🥝", "title": "kiwi fruit" },
            { "emoji": "🍅", "title": "tomato" },
            { "emoji": "🍆", "title": "eggplant" },
            { "emoji": "🥑", "title": "avocado" },
            { "emoji": "🥦", "title": "broccoli" },
            { "emoji": "🥬", "title": "leafy green" },
            { "emoji": "🥒", "title": "cucumber" },
            { "emoji": "🌶️", "title": "hot pepper" },
            { "emoji": "🫑", "title": "bell pepper" },
            { "emoji": "🌽", "title": "ear of corn" },
            { "emoji": "🥕", "title": "carrot" },
            { "emoji": "🫒", "title": "olive" },
            { "emoji": "🧄", "title": "garlic" },
            { "emoji": "🧅", "title": "onion" },
            { "emoji": "🥔", "title": "potato" },
            { "emoji": "🍠", "title": "roasted sweet potato" },
            { "emoji": "🥐", "title": "croissant" },
            { "emoji": "🥯", "title": "bagel" },
            { "emoji": "🍞", "title": "bread" },
            { "emoji": "🥖", "title": "baguette bread" },
            { "emoji": "🥨", "title": "pretzel" },
            { "emoji": "🧀", "title": "cheese wedge" },
            { "emoji": "🥚", "title": "egg" },
            { "emoji": "🍳", "title": "cooking" },
            { "emoji": "🧈", "title": "butter" },
            { "emoji": "🥞", "title": "pancakes" },
            { "emoji": "🧇", "title": "waffle" },
            { "emoji": "🥓", "title": "bacon" },
            { "emoji": "🥩", "title": "cut of meat" },
            { "emoji": "🍗", "title": "poultry leg" },
            { "emoji": "🍖", "title": "meat on bone" },
            { "emoji": "🦴", "title": "bone" },
            { "emoji": "🌭", "title": "hot dog" },
            { "emoji": "🍔", "title": "hamburger" },
            { "emoji": "🍟", "title": "french fries" },
            { "emoji": "🍕", "title": "pizza" },
            { "emoji": "🫓", "title": "flatbread" },
            { "emoji": "🥪", "title": "sandwich" },
            { "emoji": "🥙", "title": "stuffed flatbread" },
            { "emoji": "🧆", "title": "falafel" },
            { "emoji": "🌮", "title": "taco" },
            { "emoji": "🌯", "title": "burrito" },
            { "emoji": "🫔", "title": "tamale" },
            { "emoji": "🥗", "title": "green salad" },
            { "emoji": "🥘", "title": "shallow pan of food" },
            { "emoji": "🫕", "title": "fondue" },
            { "emoji": "🥫", "title": "canned food" },
            { "emoji": "🫙", "title": "jar" },
            { "emoji": "🍝", "title": "spaghetti" },
            { "emoji": "🍜", "title": "steaming bowl" },
            { "emoji": "🍲", "title": "pot of food" },
            { "emoji": "🍛", "title": "curry rice" },
            { "emoji": "🍣", "title": "sushi" },
            { "emoji": "🍱", "title": "bento box" },
            { "emoji": "🥟", "title": "dumpling" },
            { "emoji": "🦪", "title": "oyster" },
            { "emoji": "🍤", "title": "fried shrimp" },
            { "emoji": "🍙", "title": "rice ball" },
            { "emoji": "🍚", "title": "cooked rice" },
            { "emoji": "🍘", "title": "rice cracker" },
            { "emoji": "🍥", "title": "fish cake with swirl" },
            { "emoji": "🥠", "title": "fortune cookie" },
            { "emoji": "🥮", "title": "moon cake" },
            { "emoji": "🍢", "title": "oden" },
            { "emoji": "🍡", "title": "dango" },
            { "emoji": "🍧", "title": "shaved ice" },
            { "emoji": "🍨", "title": "ice cream" },
            { "emoji": "🍦", "title": "soft ice cream" },
            { "emoji": "🥧", "title": "pie" },
            { "emoji": "🧁", "title": "cupcake" },
            { "emoji": "🍰", "title": "shortcake" },
            { "emoji": "🎂", "title": "birthday cake" },
            { "emoji": "🍮", "title": "custard" },
            { "emoji": "🍭", "title": "lollipop" },
            { "emoji": "🍬", "title": "candy" },
            { "emoji": "🍫", "title": "chocolate bar" },
            { "emoji": "🍿", "title": "popcorn" },
            { "emoji": "🍩", "title": "doughnut" },
            { "emoji": "🍪", "title": "cookie" },
            { "emoji": "🌰", "title": "chestnut" },
            { "emoji": "🥜", "title": "peanuts" },
            { "emoji": "🫘", "title": "beans" },
            { "emoji": "🍯", "title": "honey pot" },
            { "emoji": "🥛", "title": "glass of milk" },
            { "emoji": "🫗", "title": "pouring liquid" },
            { "emoji": "🍼", "title": "baby bottle" },
            { "emoji": "🫖", "title": "teapot" },
            { "emoji": "☕", "title": "hot beverage" },
            { "emoji": "🍵", "title": "teacup without handle" },
            { "emoji": "🧃", "title": "beverage box" },
            { "emoji": "🥤", "title": "cup with straw" },
            { "emoji": "🧋", "title": "bubble tea" },
            { "emoji": "🍶", "title": "sake" },
            { "emoji": "🍺", "title": "beer mug" },
            { "emoji": "🍻", "title": "clinking beer mugs" },
            { "emoji": "🥂", "title": "clinking glasses" },
            { "emoji": "🍷", "title": "wine glass" },
            { "emoji": "🥃", "title": "tumbler glass" },
            { "emoji": "🍸", "title": "cocktail glass" },
            { "emoji": "🍹", "title": "tropical drink" },
            { "emoji": "🧉", "title": "mate" },
            { "emoji": "🍾", "title": "bottle with popping cork" },
            { "emoji": "🧊", "title": "ice" },
            { "emoji": "🥄", "title": "spoon" },
            { "emoji": "🍴", "title": "fork and knife" },
            { "emoji": "🍽️", "title": "fork and knife with plate" },
            { "emoji": "🥣", "title": "bowl with spoon" },
            { "emoji": "🥡", "title": "takeout box" },
            { "emoji": "🥢", "title": "chopsticks" },
            { "emoji": "🧂", "title": "salt" }
        ],
        'activity': [   // Activity
            { "emoji": "⚽", "title": "soccer ball" },
            { "emoji": "🏀", "title": "basketball" },
            { "emoji": "🏈", "title": "american football" },
            { "emoji": "⚾", "title": "baseball" },
            { "emoji": "🥎", "title": "softball" },
            { "emoji": "🎾", "title": "tennis" },
            { "emoji": "🏐", "title": "volleyball" },
            { "emoji": "🏉", "title": "rugby football" },
            { "emoji": "🥏", "title": "flying disc" },
            { "emoji": "🎱", "title": "pool 8 ball" },
            { "emoji": "🪀", "title": "yo-yo" },
            { "emoji": "🏓", "title": "ping pong" },
            { "emoji": "🏸", "title": "badminton" },
            { "emoji": "🏒", "title": "ice hockey" },
            { "emoji": "🏑", "title": "field hockey" },
            { "emoji": "🥍", "title": "lacrosse" },
            { "emoji": "🏏", "title": "cricket game" },
            { "emoji": "🪃", "title": "boomerang" },
            { "emoji": "🥅", "title": "goal net" },
            { "emoji": "⛳", "title": "flag in hole" },
            { "emoji": "🪁", "title": "kite" },
            { "emoji": "🛝", "title": "playground slide" },
            { "emoji": "🏹", "title": "bow and arrow" },
            { "emoji": "🎣", "title": "fishing pole" },
            { "emoji": "🤿", "title": "diving mask" },
            { "emoji": "🥊", "title": "boxing glove" },
            { "emoji": "🥋", "title": "martial arts uniform" },
            { "emoji": "🎽", "title": "running shirt" },
            { "emoji": "🛹", "title": "skateboard" },
            { "emoji": "🛼", "title": "roller skate" },
            { "emoji": "🛷", "title": "sled" },
            { "emoji": "⛸️", "title": "ice skate" },
            { "emoji": "🥌", "title": "curling stone" },
            { "emoji": "🎿", "title": "skis" },
            { "emoji": "⛷️", "title": "skier" },
            { "emoji": "🏂", "title": "snowboarder" },
            { "emoji": "🪂", "title": "parachute" },
            { "emoji": "🏋️‍♀️", "title": "woman lifting weights" },
            { "emoji": "🏋️", "title": "person lifting weights" },
            { "emoji": "🏋️‍♂️", "title": "man lifting weights" },
            { "emoji": "🤼‍♀️", "title": "women wrestling" },
            { "emoji": "🤼", "title": "people wrestling" },
            { "emoji": "🤼‍♂️", "title": "men wrestling" },
            { "emoji": "🤸‍♀️", "title": "woman cartwheeling" },
            { "emoji": "🤸", "title": "person cartwheeling" },
            { "emoji": "🤸‍♂️", "title": "man cartwheeling" },
            { "emoji": "⛹️‍♀️", "title": "woman bouncing ball" },
            { "emoji": "⛹️", "title": "person bouncing ball" },
            { "emoji": "⛹️‍♂️", "title": "man bouncing ball" },
            { "emoji": "🤺", "title": "person fencing" },
            { "emoji": "🤾‍♀️", "title": "woman playing handball" },
            { "emoji": "🤾", "title": "person playing handball" },
            { "emoji": "🤾‍♂️", "title": "man playing handball" },
            { "emoji": "🏌️‍♀️", "title": "woman golfing" },
            { "emoji": "🏌️", "title": "person golfing" },
            { "emoji": "🏌️‍♂️", "title": "man golfing" },
            { "emoji": "🏇", "title": "horse racing" },
            { "emoji": "🧘‍♀️", "title": "woman in lotus position" },
            { "emoji": "🧘", "title": "person in lotus position" },
            { "emoji": "🧘‍♂️", "title": "man in lotus position" },
            { "emoji": "🏄‍♀️", "title": "woman surfing" },
            { "emoji": "🏄", "title": "person surfing" },
            { "emoji": "🏄‍♂️", "title": "man surfing" },
            { "emoji": "🏊‍♀️", "title": "woman swimming" },
            { "emoji": "🏊", "title": "person swimming" },
            { "emoji": "🏊‍♂️", "title": "man swimming" },
            { "emoji": "🤽‍♀️", "title": "woman playing water polo" },
            { "emoji": "🤽", "title": "person playing water polo" },
            { "emoji": "🤽‍♂️", "title": "man playing water polo" },
            { "emoji": "🚣‍♀️", "title": "woman rowing boat" },
            { "emoji": "🚣", "title": "person rowing boat" },
            { "emoji": "🚣‍♂️", "title": "man rowing boat" },
            { "emoji": "🧗‍♀️", "title": "woman climbing" },
            { "emoji": "🧗", "title": "person climbing" },
            { "emoji": "🧗‍♂️", "title": "man climbing" },
            { "emoji": "🚵‍♀️", "title": "woman mountain biking" },
            { "emoji": "🚵", "title": "person mountain biking" },
            { "emoji": "🚵‍♂️", "title": "man mountain biking" },
            { "emoji": "🚴‍♀️", "title": "woman biking" },
            { "emoji": "🚴", "title": "person biking" },
            { "emoji": "🚴‍♂️", "title": "man biking" },
            { "emoji": "🏆", "title": "trophy" },
            { "emoji": "🥇", "title": "1st place medal" },
            { "emoji": "🥈", "title": "2nd place medal" },
            { "emoji": "🥉", "title": "3rd place medal" },
            { "emoji": "🏅", "title": "sports medal" },
            { "emoji": "🎖️", "title": "military medal" },
            { "emoji": "🏵️", "title": "rosette" },
            { "emoji": "🎗️", "title": "reminder ribbon" },
            { "emoji": "🎫", "title": "ticket" },
            { "emoji": "🎟️", "title": "admission tickets" },
            { "emoji": "🎪", "title": "circus tent" },
            { "emoji": "🤹‍♀️", "title": "woman juggling" },
            { "emoji": "🤹", "title": "person juggling" },
            { "emoji": "🤹‍♂️", "title": "man juggling" },
            { "emoji": "🎭", "title": "performing arts" },
            { "emoji": "🩰", "title": "ballet shoes" },
            { "emoji": "🎨", "title": "artist palette" },
            { "emoji": "🎬", "title": "clapper board" },
            { "emoji": "🎤", "title": "microphone" },
            { "emoji": "🎧", "title": "headphone" },
            { "emoji": "🎼", "title": "musical score" },
            { "emoji": "🎹", "title": "musical keyboard" },
            { "emoji": "🥁", "title": "drum" },
            { "emoji": "🪘", "title": "long drum" },
            { "emoji": "🎷", "title": "saxophone" },
            { "emoji": "🎺", "title": "trumpet" },
            { "emoji": "🪗", "title": "accordion" },
            { "emoji": "🎸", "title": "guitar" },
            { "emoji": "🪕", "title": "banjo" },
            { "emoji": "🎻", "title": "violin" },
            { "emoji": "🎲", "title": "game die" },
            { "emoji": "♟️", "title": "chess pawn" },
            { "emoji": "🎯", "title": "direct hit" },
            { "emoji": "🎳", "title": "bowling" },
            { "emoji": "🎮", "title": "video game" },
            { "emoji": "🎰", "title": "slot machine" },
            { "emoji": "🧩", "title": "puzzle piece" }
        ],
        'travel-places': [  // Travel and places
            { "emoji": "🚗", "title": "automobile" },
            { "emoji": "🚕", "title": "taxi" },
            { "emoji": "🚙", "title": "sport utility vehicle" },
            { "emoji": "🚌", "title": "bus" },
            { "emoji": "🚎", "title": "trolleybus" },
            { "emoji": "🏎️", "title": "racing car" },
            { "emoji": "🚓", "title": "police car" },
            { "emoji": "🚑", "title": "ambulance" },
            { "emoji": "🚒", "title": "fire engine" },
            { "emoji": "🚐", "title": "minibus" },
            { "emoji": "🛻", "title": "pickup truck" },
            { "emoji": "🚚", "title": "delivery truck" },
            { "emoji": "🚛", "title": "articulated lorry" },
            { "emoji": "🚜", "title": "tractor" },
            { "emoji": "🦯", "title": "white cane" },
            { "emoji": "🦽", "title": "manual wheelchair" },
            { "emoji": "🦼", "title": "motorized wheelchair" },
            { "emoji": "🩼", "title": "crutch" },
            { "emoji": "🛴", "title": "kick scooter" },
            { "emoji": "🚲", "title": "bicycle" },
            { "emoji": "🛵", "title": "motor scooter" },
            { "emoji": "🏍️", "title": "motorcycle" },
            { "emoji": "🛺", "title": "auto rickshaw" },
            { "emoji": "🛞", "title": "wheel" },
            { "emoji": "🚨", "title": "police car light" },
            { "emoji": "🚔", "title": "oncoming police car" },
            { "emoji": "🚍", "title": "oncoming bus" },
            { "emoji": "🚘", "title": "oncoming automobile" },
            { "emoji": "🚖", "title": "oncoming taxi" },
            { "emoji": "🚡", "title": "aerial tramway" },
            { "emoji": "🚠", "title": "mountain cableway" },
            { "emoji": "🚟", "title": "suspension railway" },
            { "emoji": "🚃", "title": "railway car" },
            { "emoji": "🚋", "title": "tram car" },
            { "emoji": "🚞", "title": "mountain railway" },
            { "emoji": "🚝", "title": "monorail" },
            { "emoji": "🚄", "title": "high-speed train" },
            { "emoji": "🚅", "title": "bullet train" },
            { "emoji": "🚈", "title": "light rail" },
            { "emoji": "🚂", "title": "locomotive" },
            { "emoji": "🚆", "title": "train" },
            { "emoji": "🚇", "title": "metro" },
            { "emoji": "🚊", "title": "tram" },
            { "emoji": "🚉", "title": "station" },
            { "emoji": "✈️", "title": "airplane" },
            { "emoji": "🛫", "title": "airplane departure" },
            { "emoji": "🛬", "title": "airplane arrival" },
            { "emoji": "🛩️", "title": "small airplane" },
            { "emoji": "💺", "title": "seat" },
            { "emoji": "🛰️", "title": "satellite" },
            { "emoji": "🚀", "title": "rocket" },
            { "emoji": "🛸", "title": "flying saucer" },
            { "emoji": "🚁", "title": "helicopter" },
            { "emoji": "🛶", "title": "canoe" },
            { "emoji": "⛵", "title": "sailboat" },
            { "emoji": "🚤", "title": "speedboat" },
            { "emoji": "🛥️", "title": "motor boat" },
            { "emoji": "🛳️", "title": "passenger ship" },
            { "emoji": "⛴️", "title": "ferry" },
            { "emoji": "🚢", "title": "ship" },
            { "emoji": "🛟", "title": "ring buoy" },
            { "emoji": "⚓", "title": "anchor" },
            { "emoji": "🪝", "title": "hook" },
            { "emoji": "⛽", "title": "fuel pump" },
            { "emoji": "🚧", "title": "construction" },
            { "emoji": "🚦", "title": "vertical traffic light" },
            { "emoji": "🚥", "title": "horizontal traffic light" },
            { "emoji": "🚏", "title": "bus stop" },
            { "emoji": "🗺️", "title": "world map" },
            { "emoji": "🗿", "title": "moai" },
            { "emoji": "🗽", "title": "Statue of Liberty" },
            { "emoji": "🗼", "title": "Tokyo tower" },
            { "emoji": "🏰", "title": "castle" },
            { "emoji": "🏯", "title": "Japanese castle" },
            { "emoji": "🏟️", "title": "stadium" },
            { "emoji": "🎡", "title": "ferris wheel" },
            { "emoji": "🎢", "title": "roller coaster" },
            { "emoji": "🎠", "title": "carousel horse" },
            { "emoji": "⛲", "title": "fountain" },
            { "emoji": "⛱️", "title": "umbrella on ground" },
            { "emoji": "🏖️", "title": "beach with umbrella" },
            { "emoji": "🏝️", "title": "desert island" },
            { "emoji": "🏜️", "title": "desert" },
            { "emoji": "🌋", "title": "volcano" },
            { "emoji": "⛰️", "title": "mountain" },
            { "emoji": "🏔️", "title": "snow-capped mountain" },
            { "emoji": "🗻", "title": "mount fuji" },
            { "emoji": "🏕️", "title": "camping" },
            { "emoji": "⛺", "title": "tent" },
            { "emoji": "🛖", "title": "hut" },
            { "emoji": "🏠", "title": "house" },
            { "emoji": "🏡", "title": "house with garden" },
            { "emoji": "🏘️", "title": "houses" },
            { "emoji": "🏚️", "title": "derelict house" },
            { "emoji": "🏗️", "title": "building construction" },
            { "emoji": "🏭", "title": "factory" },
            { "emoji": "🏢", "title": "office building" },
            { "emoji": "🏬", "title": "department store" },
            { "emoji": "🏣", "title": "Japanese post office" },
            { "emoji": "🏤", "title": "post office" },
            { "emoji": "🏥", "title": "hospital" },
            { "emoji": "🏦", "title": "bank" },
            { "emoji": "🏨", "title": "hotel" },
            { "emoji": "🏪", "title": "convenience store" },
            { "emoji": "🏫", "title": "school" },
            { "emoji": "🏩", "title": "love hotel" },
            { "emoji": "💒", "title": "wedding" },
            { "emoji": "🏛️", "title": "classical building" },
            { "emoji": "⛪", "title": "church" },
            { "emoji": "🕌", "title": "mosque" },
            { "emoji": "🕍", "title": "synagogue" },
            { "emoji": "🛕", "title": "hindu temple" },
            { "emoji": "🕋", "title": "kaaba" },
            { "emoji": "⛩️", "title": "shinto shrine" },
            { "emoji": "🛤️", "title": "railway track" },
            { "emoji": "🛣️", "title": "motorway" },
            { "emoji": "🗾", "title": "map of Japan" },
            { "emoji": "🎑", "title": "moon viewing ceremony" },
            { "emoji": "🏞️", "title": "national park" },
            { "emoji": "🌅", "title": "sunrise" },
            { "emoji": "🌄", "title": "sunrise over mountains" },
            { "emoji": "🌠", "title": "shooting star" },
            { "emoji": "🎇", "title": "sparkler" },
            { "emoji": "🎆", "title": "fireworks" },
            { "emoji": "🌇", "title": "sunset" },
            { "emoji": "🌆", "title": "cityscape at dusk" },
            { "emoji": "🏙️", "title": "cityscape" },
            { "emoji": "🌃", "title": "night with stars" },
            { "emoji": "🌌", "title": "milky way" },
            { "emoji": "🌉", "title": "bridge at night" },
            { "emoji": "🌁", "title": "foggy" }
        ],
        'objects': [    // Objects
            { "emoji": "⌚", "title": "watch" },
            { "emoji": "📱", "title": "mobile phone" },
            { "emoji": "📲", "title": "mobile phone with arrow" },
            { "emoji": "💻", "title": "laptop" },
            { "emoji": "⌨️", "title": "keyboard" },
            { "emoji": "🖥️", "title": "desktop computer" },
            { "emoji": "🖨️", "title": "printer" },
            { "emoji": "🖱️", "title": "computer mouse" },
            { "emoji": "🖲️", "title": "trackball" },
            { "emoji": "🕹️", "title": "joystick" },
            { "emoji": "🗜️", "title": "clamp" },
            { "emoji": "💽", "title": "computer disk" },
            { "emoji": "💾", "title": "floppy disk" },
            { "emoji": "💿", "title": "optical disk" },
            { "emoji": "📀", "title": "dvd" },
            { "emoji": "📼", "title": "videocassette" },
            { "emoji": "📷", "title": "camera" },
            { "emoji": "📸", "title": "camera with flash" },
            { "emoji": "📹", "title": "video camera" },
            { "emoji": "🎥", "title": "movie camera" },
            { "emoji": "📽️", "title": "film projector" },
            { "emoji": "🎞️", "title": "film frames" },
            { "emoji": "📞", "title": "telephone receiver" },
            { "emoji": "☎️", "title": "telephone" },
            { "emoji": "📟", "title": "pager" },
            { "emoji": "📠", "title": "fax machine" },
            { "emoji": "📺", "title": "television" },
            { "emoji": "📻", "title": "radio" },
            { "emoji": "🎙️", "title": "studio microphone" },
            { "emoji": "🎚️", "title": "level slider" },
            { "emoji": "🎛️", "title": "control knobs" },
            { "emoji": "🧭", "title": "compass" },
            { "emoji": "⏱️", "title": "stopwatch" },
            { "emoji": "⏲️", "title": "timer clock" },
            { "emoji": "⏰", "title": "alarm clock" },
            { "emoji": "🕰️", "title": "mantelpiece clock" },
            { "emoji": "⌛", "title": "hourglass done" },
            { "emoji": "⏳", "title": "hourglass not done" },
            { "emoji": "📡", "title": "satellite antenna" },
            { "emoji": "🔋", "title": "battery" },
            { "emoji": "🪫", "title": "low battery" },
            { "emoji": "🔌", "title": "electric plug" },
            { "emoji": "💡", "title": "light bulb" },
            { "emoji": "🔦", "title": "flashlight" },
            { "emoji": "🕯️", "title": "candle" },
            { "emoji": "🪔", "title": "diya lamp" },
            { "emoji": "🧯", "title": "fire extinguisher" },
            { "emoji": "🛢️", "title": "oil drum" },
            { "emoji": "💸", "title": "money with wings" },
            { "emoji": "💵", "title": "dollar banknote" },
            { "emoji": "💴", "title": "yen banknote" },
            { "emoji": "💶", "title": "euro banknote" },
            { "emoji": "💷", "title": "pound banknote" },
            { "emoji": "🪙", "title": "coin" },
            { "emoji": "💰", "title": "money bag" },
            { "emoji": "💳", "title": "credit card" },
            { "emoji": "🪪", "title": "identification card" },
            { "emoji": "💎", "title": "gem stone" },
            { "emoji": "⚖️", "title": "balance scale" },
            { "emoji": "🪜", "title": "ladder" },
            { "emoji": "🧰", "title": "toolbox" },
            { "emoji": "🪛", "title": "screwdriver" },
            { "emoji": "🔧", "title": "wrench" },
            { "emoji": "🔨", "title": "hammer" },
            { "emoji": "⚒️", "title": "hammer and pick" },
            { "emoji": "🛠️", "title": "hammer and wrench" },
            { "emoji": "⛏️", "title": "pick" },
            { "emoji": "🪚", "title": "carpentry saw" },
            { "emoji": "🔩", "title": "nut and bolt" },
            { "emoji": "⚙️", "title": "gear" },
            { "emoji": "🪤", "title": "mouse trap" },
            { "emoji": "🧱", "title": "brick" },
            { "emoji": "⛓️", "title": "chains" },
            { "emoji": "🧲", "title": "magnet" },
            { "emoji": "🔫", "title": "pistol" },
            { "emoji": "💣", "title": "bomb" },
            { "emoji": "🧨", "title": "firecracker" },
            { "emoji": "🪓", "title": "axe" },
            { "emoji": "🔪", "title": "kitchen knife" },
            { "emoji": "🗡️", "title": "dagger" },
            { "emoji": "⚔️", "title": "crossed swords" },
            { "emoji": "🛡️", "title": "shield" },
            { "emoji": "🚬", "title": "cigarette" },
            { "emoji": "⚰️", "title": "coffin" },
            { "emoji": "🪦", "title": "headstone" },
            { "emoji": "⚱️", "title": "funeral urn" },
            { "emoji": "🏺", "title": "amphora" },
            { "emoji": "🔮", "title": "crystal ball" },
            { "emoji": "📿", "title": "prayer beads" },
            { "emoji": "🧿", "title": "nazar amulet" },
            { "emoji": "🪬", "title": "hamsa" },
            { "emoji": "💈", "title": "barber pole" },
            { "emoji": "⚗️", "title": "alembic" },
            { "emoji": "🔭", "title": "telescope" },
            { "emoji": "🔬", "title": "microscope" },
            { "emoji": "🕳️", "title": "hole" },
            { "emoji": "🩻", "title": "x-ray" },
            { "emoji": "🩹", "title": "adhesive bandage" },
            { "emoji": "🩺", "title": "stethoscope" },
            { "emoji": "💊", "title": "pill" },
            { "emoji": "💉", "title": "syringe" },
            { "emoji": "🩸", "title": "drop of blood" },
            { "emoji": "🧬", "title": "dna" },
            { "emoji": "🦠", "title": "microbe" },
            { "emoji": "🧫", "title": "petri dish" },
            { "emoji": "🧪", "title": "test tube" },
            { "emoji": "🌡️", "title": "thermometer" },
            { "emoji": "🧹", "title": "broom" },
            { "emoji": "🪠", "title": "plunger" },
            { "emoji": "🧺", "title": "basket" },
            { "emoji": "🧻", "title": "roll of paper" },
            { "emoji": "🚽", "title": "toilet" },
            { "emoji": "🚰", "title": "potable water" },
            { "emoji": "🚿", "title": "shower" },
            { "emoji": "🛁", "title": "bathtub" },
            { "emoji": "🛀", "title": "person taking bath" },
            { "emoji": "🧼", "title": "soap" },
            { "emoji": "🪥", "title": "toothbrush" },
            { "emoji": "🪒", "title": "razor" },
            { "emoji": "🧽", "title": "sponge" },
            { "emoji": "🪣", "title": "bucket" },
            { "emoji": "🧴", "title": "lotion bottle" },
            { "emoji": "🛎️", "title": "bellhop bell" },
            { "emoji": "🔑", "title": "key" },
            { "emoji": "🗝️", "title": "old key" },
            { "emoji": "🚪", "title": "door" },
            { "emoji": "🪑", "title": "chair" },
            { "emoji": "🛋️", "title": "couch and lamp" },
            { "emoji": "🛏️", "title": "bed" },
            { "emoji": "🛌", "title": "person in bed" },
            { "emoji": "🧸", "title": "teddy bear" },
            { "emoji": "🪆", "title": "nesting dolls" },
            { "emoji": "🖼️", "title": "framed picture" },
            { "emoji": "🪞", "title": "mirror" },
            { "emoji": "🪟", "title": "window" },
            { "emoji": "🛍️", "title": "shopping bags" },
            { "emoji": "🛒", "title": "shopping cart" },
            { "emoji": "🎁", "title": "wrapped gift" },
            { "emoji": "🎈", "title": "balloon" },
            { "emoji": "🎏", "title": "carp streamer" },
            { "emoji": "🎀", "title": "ribbon" },
            { "emoji": "🪄", "title": "magic wand" },
            { "emoji": "🪅", "title": "piñata" },
            { "emoji": "🎊", "title": "confetti ball" },
            { "emoji": "🎉", "title": "party popper" },
            { "emoji": "🎎", "title": "Japanese dolls" },
            { "emoji": "🏮", "title": "red paper lantern" },
            { "emoji": "🎐", "title": "wind chime" },
            { "emoji": "🪩", "title": "mirror ball" },
            { "emoji": "🧧", "title": "red envelope" },
            { "emoji": "✉️", "title": "envelope" },
            { "emoji": "📩", "title": "envelope with arrow" },
            { "emoji": "📨", "title": "incoming envelope" },
            { "emoji": "📧", "title": "e-mail" },
            { "emoji": "💌", "title": "love letter" },
            { "emoji": "📥", "title": "inbox tray" },
            { "emoji": "📤", "title": "outbox tray" },
            { "emoji": "📦", "title": "package" },
            { "emoji": "🏷️", "title": "label" },
            { "emoji": "🪧", "title": "placard" },
            { "emoji": "📪", "title": "closed mailbox with lowered flag" },
            { "emoji": "📫", "title": "closed mailbox with raised flag" },
            { "emoji": "📬", "title": "open mailbox with raised flag" },
            { "emoji": "📭", "title": "open mailbox with lowered flag" },
            { "emoji": "📮", "title": "postbox" },
            { "emoji": "📯", "title": "postal horn" },
            { "emoji": "📜", "title": "scroll" },
            { "emoji": "📃", "title": "page with curl" },
            { "emoji": "📄", "title": "page facing up" },
            { "emoji": "📑", "title": "bookmark tabs" },
            { "emoji": "🧾", "title": "receipt" },
            { "emoji": "📊", "title": "bar chart" },
            { "emoji": "📈", "title": "chart increasing" },
            { "emoji": "📉", "title": "chart decreasing" },
            { "emoji": "🗒️", "title": "spiral notepad" },
            { "emoji": "🗓️", "title": "spiral calendar" },
            { "emoji": "📅", "title": "calendar" },
            { "emoji": "📆", "title": "tear-off calendar" },
            { "emoji": "🗑️", "title": "wastebasket" },
            { "emoji": "📇", "title": "card index" },
            { "emoji": "🗃️", "title": "card file box" },
            { "emoji": "🗳️", "title": "ballot box with ballot" },
            { "emoji": "🗄️", "title": "file cabinet" },
            { "emoji": "📋", "title": "clipboard" },
            { "emoji": "📁", "title": "file folder" },
            { "emoji": "📂", "title": "open file folder" },
            { "emoji": "🗂️", "title": "card index dividers" },
            { "emoji": "🗞️", "title": "rolled-up newspaper" },
            { "emoji": "📰", "title": "newspaper" },
            { "emoji": "📓", "title": "notebook" },
            { "emoji": "📔", "title": "notebook with decorative cover" },
            { "emoji": "📒", "title": "ledger" },
            { "emoji": "📕", "title": "closed book" },
            { "emoji": "📗", "title": "green book" },
            { "emoji": "📘", "title": "blue book" },
            { "emoji": "📙", "title": "orange book" },
            { "emoji": "📚", "title": "books" },
            { "emoji": "📖", "title": "open book" },
            { "emoji": "🔖", "title": "bookmark" },
            { "emoji": "🧷", "title": "safety pin" },
            { "emoji": "🔗", "title": "link" },
            { "emoji": "📎", "title": "paperclip" },
            { "emoji": "🖇️", "title": "linked paperclips" },
            { "emoji": "📐", "title": "triangular ruler" },
            { "emoji": "📏", "title": "straight ruler" },
            { "emoji": "🧮", "title": "abacus" },
            { "emoji": "📌", "title": "pushpin" },
            { "emoji": "📍", "title": "round pushpin" },
            { "emoji": "✂️", "title": "scissors" },
            { "emoji": "🖊️", "title": "pen" },
            { "emoji": "🖋️", "title": "fountain pen" },
            { "emoji": "✒️", "title": "black nib" },
            { "emoji": "🖌️", "title": "paintbrush" },
            { "emoji": "🖍️", "title": "crayon" },
            { "emoji": "📝", "title": "memo" },
            { "emoji": "✏️", "title": "pencil" },
            { "emoji": "🔍", "title": "magnifying glass tilted left" },
            { "emoji": "🔎", "title": "magnifying glass tilted right" },
            { "emoji": "🔏", "title": "locked with pen" },
            { "emoji": "🔐", "title": "locked with key" },
            { "emoji": "🔒", "title": "locked" },
            { "emoji": "🔓", "title": "unlocked" }
        ],
        'symbols': [    // Symbols
            { "emoji": "❤️", "title": "red heart" },
            { "emoji": "🧡", "title": "orange heart" },
            { "emoji": "💛", "title": "yellow heart" },
            { "emoji": "💚", "title": "green heart" },
            { "emoji": "💙", "title": "blue heart" },
            { "emoji": "💜", "title": "purple heart" },
            { "emoji": "🖤", "title": "black heart" },
            { "emoji": "🤍", "title": "white heart" },
            { "emoji": "🤎", "title": "brown heart" },
            { "emoji": "💔", "title": "broken heart" },
            { "emoji": "❤️‍🔥", "title": "heart on fire" },
            { "emoji": "❤️‍🩹", "title": "mending heart" },
            { "emoji": "❣️", "title": "heart exclamation" },
            { "emoji": "💕", "title": "two hearts" },
            { "emoji": "💞", "title": "revolving hearts" },
            { "emoji": "💓", "title": "beating heart" },
            { "emoji": "💗", "title": "growing heart" },
            { "emoji": "💖", "title": "sparkling heart" },
            { "emoji": "💘", "title": "heart with arrow" },
            { "emoji": "💝", "title": "heart with ribbon" },
            { "emoji": "💟", "title": "heart decoration" },
            { "emoji": "☮️", "title": "peace symbol" },
            { "emoji": "✝️", "title": "latin cross" },
            { "emoji": "☪️", "title": "star and crescent" },
            { "emoji": "🕉️", "title": "om" },
            { "emoji": "☸️", "title": "wheel of dharma" },
            { "emoji": "✡️", "title": "star of David" },
            { "emoji": "🔯", "title": "dotted six-pointed star" },
            { "emoji": "🕎", "title": "menorah" },
            { "emoji": "☯️", "title": "yin yang" },
            { "emoji": "☦️", "title": "orthodox cross" },
            { "emoji": "🛐", "title": "place of worship" },
            { "emoji": "⛎", "title": "Ophiuchus" },
            { "emoji": "♈", "title": "Aries" },
            { "emoji": "♉", "title": "Taurus" },
            { "emoji": "♊", "title": "Gemini" },
            { "emoji": "♋", "title": "Cancer" },
            { "emoji": "♌", "title": "Leo" },
            { "emoji": "♍", "title": "Virgo" },
            { "emoji": "♎", "title": "Libra" },
            { "emoji": "♏", "title": "Scorpio" },
            { "emoji": "♐", "title": "Sagittarius" },
            { "emoji": "♑", "title": "Capricorn" },
            { "emoji": "♒", "title": "Aquarius" },
            { "emoji": "♓", "title": "Pisces" },
            { "emoji": "🆔", "title": "ID button" },
            { "emoji": "⚛️", "title": "atom symbol" },
            { "emoji": "🉑", "title": "Japanese “acceptable” button" },
            { "emoji": "☢️", "title": "radioactive" },
            { "emoji": "☣️", "title": "biohazard" },
            { "emoji": "📴", "title": "mobile phone off" },
            { "emoji": "📳", "title": "vibration mode" },
            { "emoji": "🈶", "title": "Japanese “not free of charge” button" },
            { "emoji": "🈚", "title": "Japanese “free of charge” button" },
            { "emoji": "🈸", "title": "Japanese “application” button" },
            { "emoji": "🈺", "title": "Japanese “open for business” button" },
            { "emoji": "🈷️", "title": "Japanese “monthly amount” button" },
            { "emoji": "✴️", "title": "eight-pointed star" },
            { "emoji": "🆚", "title": "VS button" },
            { "emoji": "💮", "title": "white flower" },
            { "emoji": "🉐", "title": "Japanese “bargain” button" },
            { "emoji": "㊙️", "title": "Japanese “secret” button" },
            { "emoji": "㊗️", "title": "Japanese “congratulations” button" },
            { "emoji": "🈴", "title": "Japanese “passing grade” button" },
            { "emoji": "🈵", "title": "Japanese “no vacancy” button" },
            { "emoji": "🈹", "title": "Japanese “discount” button" },
            { "emoji": "🈲", "title": "Japanese “prohibited” button" },
            { "emoji": "🅰️", "title": "A button (blood type)" },
            { "emoji": "🅱️", "title": "B button (blood type)" },
            { "emoji": "🆎", "title": "AB button (blood type)" },
            { "emoji": "🆑", "title": "CL button" },
            { "emoji": "🅾️", "title": "O button (blood type)" },
            { "emoji": "🆘", "title": "SOS button" },
            { "emoji": "❌", "title": "cross mark" },
            { "emoji": "⭕", "title": "hollow red circle" },
            { "emoji": "🛑", "title": "stop sign" },
            { "emoji": "⛔", "title": "no entry" },
            { "emoji": "📛", "title": "name badge" },
            { "emoji": "🚫", "title": "prohibited" },
            { "emoji": "💯", "title": "hundred points" },
            { "emoji": "💢", "title": "anger symbol" },
            { "emoji": "♨️", "title": "hot springs" },
            { "emoji": "🚷", "title": "no pedestrians" },
            { "emoji": "🚯", "title": "no littering" },
            { "emoji": "🚳", "title": "no bicycles" },
            { "emoji": "🚱", "title": "non-potable water" },
            { "emoji": "🔞", "title": "no one under eighteen" },
            { "emoji": "📵", "title": "no mobile phones" },
            { "emoji": "🚭", "title": "no smoking" },
            { "emoji": "❗", "title": "exclamation mark" },
            { "emoji": "❕", "title": "white exclamation mark" },
            { "emoji": "❓", "title": "question mark" },
            { "emoji": "❔", "title": "white question mark" },
            { "emoji": "‼️", "title": "double exclamation mark" },
            { "emoji": "⁉️", "title": "exclamation question mark" },
            { "emoji": "🔅", "title": "dim button" },
            { "emoji": "🔆", "title": "bright button" },
            { "emoji": "〽️", "title": "part alternation mark" },
            { "emoji": "⚠️", "title": "warning" },
            { "emoji": "🚸", "title": "children crossing" },
            { "emoji": "🔱", "title": "trident emblem" },
            { "emoji": "⚜️", "title": "fleur-de-lis" },
            { "emoji": "🔰", "title": "Japanese symbol for beginner" },
            { "emoji": "♻️", "title": "recycling symbol" },
            { "emoji": "✅", "title": "check mark button" },
            { "emoji": "🈯", "title": "Japanese “reserved” button" },
            { "emoji": "💹", "title": "chart increasing with yen" },
            { "emoji": "❇️", "title": "sparkle" },
            { "emoji": "✳️", "title": "eight-spoked asterisk" },
            { "emoji": "❎", "title": "cross mark button" },
            { "emoji": "🌐", "title": "globe with meridians" },
            { "emoji": "💠", "title": "diamond with a dot" },
            { "emoji": "Ⓜ️", "title": "circled M" },
            { "emoji": "🌀", "title": "cyclone" },
            { "emoji": "💤", "title": "zzz" },
            { "emoji": "🏧", "title": "ATM sign" },
            { "emoji": "🚾", "title": "water closet" },
            { "emoji": "♿", "title": "wheelchair symbol" },
            { "emoji": "🅿️", "title": "P button" },
            { "emoji": "🛗", "title": "elevator" },
            { "emoji": "🈳", "title": "Japanese “vacancy” button" },
            { "emoji": "🈂️", "title": "Japanese “service charge” button" },
            { "emoji": "🛂", "title": "passport control" },
            { "emoji": "🛃", "title": "customs" },
            { "emoji": "🛄", "title": "baggage claim" },
            { "emoji": "🛅", "title": "left luggage" },
            { "emoji": "🚹", "title": "men’s room" },
            { "emoji": "🚺", "title": "women’s room" },
            { "emoji": "🚼", "title": "baby symbol" },
            { "emoji": "♀️", "title": "female sign" },
            { "emoji": "♂️", "title": "male sign" },
            { "emoji": "⚧️", "title": "transgender symbol" },
            { "emoji": "🚻", "title": "restroom" },
            { "emoji": "🚮", "title": "litter in bin sign" },
            { "emoji": "🎦", "title": "cinema" },
            { "emoji": "📶", "title": "antenna bars" },
            { "emoji": "🈁", "title": "Japanese “here” button" },
            { "emoji": "🔣", "title": "input symbols" },
            { "emoji": "ℹ️", "title": "information" },
            { "emoji": "🔤", "title": "input latin letters" },
            { "emoji": "🔡", "title": "input latin lowercase" },
            { "emoji": "🔠", "title": "input latin uppercase" },
            { "emoji": "🆖", "title": "NG button" },
            { "emoji": "🆗", "title": "OK button" },
            { "emoji": "🆙", "title": "UP! button" },
            { "emoji": "🆒", "title": "COOL button" },
            { "emoji": "🆕", "title": "NEW button" },
            { "emoji": "🆓", "title": "FREE button" },
            { "emoji": "0️⃣", "title": "keycap: 0" },
            { "emoji": "1️⃣", "title": "keycap: 1" },
            { "emoji": "2️⃣", "title": "keycap: 2" },
            { "emoji": "3️⃣", "title": "keycap: 3" },
            { "emoji": "4️⃣", "title": "keycap: 4" },
            { "emoji": "5️⃣", "title": "keycap: 5" },
            { "emoji": "6️⃣", "title": "keycap: 6" },
            { "emoji": "7️⃣", "title": "keycap: 7" },
            { "emoji": "8️⃣", "title": "keycap: 8" },
            { "emoji": "9️⃣", "title": "keycap: 9" },
            { "emoji": "🔟", "title": "keycap: 10" },
            { "emoji": "🔢", "title": "input numbers" },
            { "emoji": "#️", "title": "hash sign" },
            { "emoji": "*️⃣", "title": "keycap: *" },
            { "emoji": "⏏️", "title": "eject button" },
            { "emoji": "▶️", "title": "play button" },
            { "emoji": "⏸️", "title": "pause button" },
            { "emoji": "⏯️", "title": "play or pause button" },
            { "emoji": "⏹️", "title": "stop button" },
            { "emoji": "⏺️", "title": "record button" },
            { "emoji": "⏭️", "title": "next track button" },
            { "emoji": "⏮️", "title": "last track button" },
            { "emoji": "⏩", "title": "fast-forward button" },
            { "emoji": "⏪", "title": "fast reverse button" },
            { "emoji": "⏫", "title": "fast up button" },
            { "emoji": "⏬", "title": "fast down button" },
            { "emoji": "◀️", "title": "reverse button" },
            { "emoji": "🔼", "title": "upwards button" },
            { "emoji": "🔽", "title": "downwards button" },
            { "emoji": "➡️", "title": "right arrow" },
            { "emoji": "⬅️", "title": "left arrow" },
            { "emoji": "⬆️", "title": "up arrow" },
            { "emoji": "⬇️", "title": "down arrow" },
            { "emoji": "↗️", "title": "up-right arrow" },
            { "emoji": "↘️", "title": "down-right arrow" },
            { "emoji": "↙️", "title": "down-left arrow" },
            { "emoji": "↖️", "title": "up-left arrow" },
            { "emoji": "↕️", "title": "up-down arrow" },
            { "emoji": "↔️", "title": "left-right arrow" },
            { "emoji": "↪️", "title": "left arrow curving right" },
            { "emoji": "↩️", "title": "right arrow curving left" },
            { "emoji": "⤴️", "title": "right arrow curving up" },
            { "emoji": "⤵️", "title": "right arrow curving down" },
            { "emoji": "🔀", "title": "shuffle tracks button" },
            { "emoji": "🔁", "title": "repeat button" },
            { "emoji": "🔂", "title": "repeat single button" },
            { "emoji": "🔄", "title": "counterclockwise arrows button" },
            { "emoji": "🔃", "title": "clockwise vertical arrows" },
            { "emoji": "🎵", "title": "musical note" },
            { "emoji": "🎶", "title": "musical notes" },
            { "emoji": "➕", "title": "plus" },
            { "emoji": "➖", "title": "minus" },
            { "emoji": "➗", "title": "divide" },
            { "emoji": "✖️", "title": "multiply" },
            { "emoji": "🟰", "title": "heavy equals sign" },
            { "emoji": "♾️", "title": "infinity" },
            { "emoji": "⚕️", "title": "medical symbol" },
            { "emoji": "💲", "title": "heavy dollar sign" },
            { "emoji": "💱", "title": "currency exchange" },
            { "emoji": "™️", "title": "trade mark" },
            { "emoji": "©️", "title": "copyright" },
            { "emoji": "®️", "title": "registered" },
            { "emoji": "👁️‍🗨️", "title": "eye in speech bubble" },
            { "emoji": "🔚", "title": "END arrow" },
            { "emoji": "🔙", "title": "BACK arrow" },
            { "emoji": "🔛", "title": "ON! arrow" },
            { "emoji": "🔝", "title": "TOP arrow" },
            { "emoji": "🔜", "title": "SOON arrow" },
            { "emoji": "〰️", "title": "wavy dash" },
            { "emoji": "➰", "title": "curly loop" },
            { "emoji": "➿", "title": "double curly loop" },
            { "emoji": "✔️", "title": "check mark" },
            { "emoji": "☑️", "title": "check box with check" },
            { "emoji": "🔘", "title": "radio button" },
            { "emoji": "🔴", "title": "red circle" },
            { "emoji": "🟠", "title": "orange circle" },
            { "emoji": "🟡", "title": "yellow circle" },
            { "emoji": "🟢", "title": "green circle" },
            { "emoji": "🔵", "title": "blue circle" },
            { "emoji": "🟣", "title": "purple circle" },
            { "emoji": "⚫", "title": "black circle" },
            { "emoji": "⚪", "title": "white circle" },
            { "emoji": "🟤", "title": "brown circle" },
            { "emoji": "🔺", "title": "red triangle pointed up" },
            { "emoji": "🔻", "title": "red triangle pointed down" },
            { "emoji": "🔸", "title": "small orange diamond" },
            { "emoji": "🔹", "title": "small blue diamond" },
            { "emoji": "🔶", "title": "large orange diamond" },
            { "emoji": "🔷", "title": "large blue diamond" },
            { "emoji": "🔳", "title": "white square button" },
            { "emoji": "🔲", "title": "black square button" },
            { "emoji": "▪️", "title": "black small square" },
            { "emoji": "▫️", "title": "white small square" },
            { "emoji": "◾", "title": "black medium-small square" },
            { "emoji": "◽", "title": "white medium-small square" },
            { "emoji": "◼️", "title": "black medium square" },
            { "emoji": "◻️", "title": "white medium square" },
            { "emoji": "🟥", "title": "red square" },
            { "emoji": "🟧", "title": "orange square" },
            { "emoji": "🟨", "title": "yellow square" },
            { "emoji": "🟩", "title": "green square" },
            { "emoji": "🟦", "title": "blue square" },
            { "emoji": "🟪", "title": "purple square" },
            { "emoji": "⬛", "title": "black large square" },
            { "emoji": "⬜", "title": "white large square" },
            { "emoji": "🟫", "title": "brown square" },
            { "emoji": "🔈", "title": "speaker low volume" },
            { "emoji": "🔇", "title": "muted speaker" },
            { "emoji": "🔉", "title": "speaker medium volume" },
            { "emoji": "🔊", "title": "speaker high volume" },
            { "emoji": "🔔", "title": "bell" },
            { "emoji": "🔕", "title": "bell with slash" },
            { "emoji": "📣", "title": "megaphone" },
            { "emoji": "📢", "title": "loudspeaker" },
            { "emoji": "💬", "title": "speech balloon" },
            { "emoji": "🗨️", "title": "left speech bubble" },
            { "emoji": "💭", "title": "thought balloon" },
            { "emoji": "🗯️", "title": "right anger bubble" },
            { "emoji": "♠️", "title": "spade suit" },
            { "emoji": "♣️", "title": "club suit" },
            { "emoji": "♥️", "title": "heart suit" },
            { "emoji": "♦️", "title": "diamond suit" },
            { "emoji": "🃏", "title": "joker" },
            { "emoji": "🎴", "title": "flower playing cards" },
            { "emoji": "🀄", "title": "mahjong red dragon" },
            { "emoji": "🕐", "title": "one o’clock" },
            { "emoji": "🕑", "title": "two o’clock" },
            { "emoji": "🕒", "title": "three o’clock" },
            { "emoji": "🕓", "title": "four o’clock" },
            { "emoji": "🕔", "title": "five o’clock" },
            { "emoji": "🕕", "title": "six o’clock" },
            { "emoji": "🕖", "title": "seven o’clock" },
            { "emoji": "🕗", "title": "eight o’clock" },
            { "emoji": "🕘", "title": "nine o’clock" },
            { "emoji": "🕙", "title": "ten o’clock" },
            { "emoji": "🕚", "title": "eleven o’clock" },
            { "emoji": "🕛", "title": "twelve o’clock" },
            { "emoji": "🕜", "title": "one-thirty" },
            { "emoji": "🕝", "title": "two-thirty" },
            { "emoji": "🕞", "title": "three-thirty" },
            { "emoji": "🕟", "title": "four-thirty" },
            { "emoji": "🕠", "title": "five-thirty" },
            { "emoji": "🕡", "title": "six-thirty" },
            { "emoji": "🕢", "title": "seven-thirty" },
            { "emoji": "🕣", "title": "eight-thirty" },
            { "emoji": "🕤", "title": "nine-thirty" },
            { "emoji": "🕥", "title": "ten-thirty" },
            { "emoji": "🕦", "title": "eleven-thirty" },
            { "emoji": "🕧", "title": "twelve-thirty" }
        ],
        'flags': [  // Flags
            { "emoji": "🏳️", "title": "white flag" },
            { "emoji": "🏴", "title": "black flag" },
            { "emoji": "🏴‍☠️", "title": "pirate flag" },
            { "emoji": "🏁", "title": "chequered flag" },
            { "emoji": "🚩", "title": "triangular flag" },
            { "emoji": "🏳️‍🌈", "title": "rainbow flag" },
            { "emoji": "🏳️‍⚧️", "title": "transgender flag" },
            { "emoji": "🇺🇳", "title": "flag: United Nations" },
            { "emoji": "🇦🇫", "title": "flag: Afghanistan" },
            { "emoji": "🇦🇽", "title": "flag: Åland Islands" },
            { "emoji": "🇦🇱", "title": "flag: Albania" },
            { "emoji": "🇩🇿", "title": "flag: Algeria" },
            { "emoji": "🇦🇸", "title": "flag: American Samoa" },
            { "emoji": "🇦🇩", "title": "flag: Andorra" },
            { "emoji": "🇦🇴", "title": "flag: Angola" },
            { "emoji": "🇦🇮", "title": "flag: Anguilla" },
            { "emoji": "🇦🇶", "title": "flag: Antarctica" },
            { "emoji": "🇦🇬", "title": "flag: Antigua & Barbuda" },
            { "emoji": "🇦🇷", "title": "flag: Argentina" },
            { "emoji": "🇦🇲", "title": "flag: Armenia" },
            { "emoji": "🇦🇼", "title": "flag: Aruba" },
            { "emoji": "🇦🇺", "title": "flag: Australia" },
            { "emoji": "🇦🇹", "title": "flag: Austria" },
            { "emoji": "🇦🇿", "title": "flag: Azerbaijan" },
            { "emoji": "🇧🇸", "title": "flag: Bahamas" },
            { "emoji": "🇧🇭", "title": "flag: Bahrain" },
            { "emoji": "🇧🇩", "title": "flag: Bangladesh" },
            { "emoji": "🇧🇧", "title": "flag: Barbados" },
            { "emoji": "🇧🇾", "title": "flag: Belarus" },
            { "emoji": "🇧🇪", "title": "flag: Belgium" },
            { "emoji": "🇧🇿", "title": "flag: Belize" },
            { "emoji": "🇧🇯", "title": "flag: Benin" },
            { "emoji": "🇧🇲", "title": "flag: Bermuda" },
            { "emoji": "🇧🇹", "title": "flag: Bhutan" },
            { "emoji": "🇧🇴", "title": "flag: Bolivia" },
            { "emoji": "🇧🇦", "title": "flag: Bosnia & Herzegovina" },
            { "emoji": "🇧🇼", "title": "flag: Botswana" },
            { "emoji": "🇧🇷", "title": "flag: Brazil" },
            { "emoji": "🇻🇬", "title": "flag: British Virgin Islands" },
            { "emoji": "🇧🇳", "title": "flag: Brunei" },
            { "emoji": "🇧🇬", "title": "flag: Bulgaria" },
            { "emoji": "🇧🇫", "title": "flag: Burkina Faso" },
            { "emoji": "🇧🇮", "title": "flag: Burundi" },
            { "emoji": "🇰🇭", "title": "flag: Cambodia" },
            { "emoji": "🇨🇲", "title": "flag: Cameroon" },
            { "emoji": "🇨🇦", "title": "flag: Canada" },
            { "emoji": "🇮🇨", "title": "flag: Canary Islands" },
            { "emoji": "🇨🇻", "title": "flag: Cape Verde" },
            { "emoji": "🇧🇶", "title": "flag: Caribbean Netherlands" },
            { "emoji": "🇰🇾", "title": "flag: Cayman Islands" },
            { "emoji": "🇨🇫", "title": "flag: Central African Republic" },
            { "emoji": "🇹🇩", "title": "flag: Chad" },
            { "emoji": "🇩🇬", "title": "flag: Diego Garcia" },
            { "emoji": "🇨🇱", "title": "flag: Chile" },
            { "emoji": "🇨🇳", "title": "flag: China" },
            { "emoji": "🇨🇽", "title": "flag: Christmas Island" },
            { "emoji": "🇨🇨", "title": "flag: Cocos (Keeling) Islands" },
            { "emoji": "🇨🇴", "title": "flag: Colombia" },
            { "emoji": "🇰🇲", "title": "flag: Comoros" },
            { "emoji": "🇨🇬", "title": "flag: Congo - Brazzaville" },
            { "emoji": "🇨🇩", "title": "flag: Congo - Kinshasa" },
            { "emoji": "🇨🇰", "title": "flag: Cook Islands" },
            { "emoji": "🇨🇷", "title": "flag: Costa Rica" },
            { "emoji": "🇨🇮", "title": "flag: Côte d’Ivoire" },
            { "emoji": "🇭🇷", "title": "flag: Croatia" },
            { "emoji": "🇨🇺", "title": "flag: Cuba" },
            { "emoji": "🇨🇼", "title": "flag: Curaçao" },
            { "emoji": "🇨🇾", "title": "flag: Cyprus" },
            { "emoji": "🇨🇿", "title": "flag: Czechia" },
            { "emoji": "🇩🇰", "title": "flag: Denmark" },
            { "emoji": "🇩🇯", "title": "flag: Djibouti" },
            { "emoji": "🇩🇲", "title": "flag: Dominica" },
            { "emoji": "🇩🇴", "title": "flag: Dominican Republic" },
            { "emoji": "🇪🇨", "title": "flag: Ecuador" },
            { "emoji": "🇪🇬", "title": "flag: Egypt" },
            { "emoji": "🇸🇻", "title": "flag: El Salvador" },
            { "emoji": "🇬🇶", "title": "flag: Equatorial Guinea" },
            { "emoji": "🇪🇷", "title": "flag: Eritrea" },
            { "emoji": "🇪🇪", "title": "flag: Estonia" },
            { "emoji": "🇸🇿", "title": "flag: Eswatini" },
            { "emoji": "🇪🇹", "title": "flag: Ethiopia" },
            { "emoji": "🇪🇺", "title": "flag: European Union" },
            { "emoji": "🇫🇰", "title": "flag: Falkland Islands" },
            { "emoji": "🇫🇴", "title": "flag: Faroe Islands" },
            { "emoji": "🇫🇯", "title": "flag: Fiji" },
            { "emoji": "🇫🇮", "title": "flag: Finland" },
            { "emoji": "🇫🇷", "title": "flag: France" },
            { "emoji": "🇬🇫", "title": "flag: French Guiana" },
            { "emoji": "🇵🇫", "title": "flag: French Polynesia" },
            { "emoji": "🇹🇫", "title": "flag: French Southern Territories" },
            { "emoji": "🇬🇦", "title": "flag: Gabon" },
            { "emoji": "🇬🇲", "title": "flag: Gambia" },
            { "emoji": "🇬🇪", "title": "flag: Georgia" },
            { "emoji": "🇩🇪", "title": "flag: Germany" },
            { "emoji": "🇬🇭", "title": "flag: Ghana" },
            { "emoji": "🇬🇮", "title": "flag: Gibraltar" },
            { "emoji": "🇬🇷", "title": "flag: Greece" },
            { "emoji": "🇬🇱", "title": "flag: Greenland" },
            { "emoji": "🇬🇩", "title": "flag: Grenada" },
            { "emoji": "🇬🇵", "title": "flag: Guadeloupe" },
            { "emoji": "🇬🇺", "title": "flag: Guam" },
            { "emoji": "🇬🇹", "title": "flag: Guatemala" },
            { "emoji": "🇬🇬", "title": "flag: Guernsey" },
            { "emoji": "🇬🇳", "title": "flag: Guinea" },
            { "emoji": "🇬🇼", "title": "flag: Guinea-Bissau" },
            { "emoji": "🇬🇾", "title": "flag: Guyana" },
            { "emoji": "🇭🇹", "title": "flag: Haiti" },
            { "emoji": "🇭🇳", "title": "flag: Honduras" },
            { "emoji": "🇭🇰", "title": "flag: Hong Kong SAR China" },
            { "emoji": "🇭🇺", "title": "flag: Hungary" },
            { "emoji": "🇮🇸", "title": "flag: Iceland" },
            { "emoji": "🇮🇳", "title": "flag: India" },
            { "emoji": "🇮🇩", "title": "flag: Indonesia" },
            { "emoji": "🇮🇷", "title": "flag: Iran" },
            { "emoji": "🇮🇶", "title": "flag: Iraq" },
            { "emoji": "🇮🇪", "title": "flag: Ireland" },
            { "emoji": "🇮🇲", "title": "flag: Isle of Man" },
            { "emoji": "🇮🇱", "title": "flag: Israel" },
            { "emoji": "🇮🇹", "title": "flag: Italy" },
            { "emoji": "🇯🇲", "title": "flag: Jamaica" },
            { "emoji": "🇯🇵", "title": "flag: Japan" },
            { "emoji": "🎌", "title": "crossed flags" },
            { "emoji": "🇯🇪", "title": "flag: Jersey" },
            { "emoji": "🇯🇴", "title": "flag: Jordan" },
            { "emoji": "🇰🇿", "title": "flag: Kazakhstan" },
            { "emoji": "🇰🇪", "title": "flag: Kenya" },
            { "emoji": "🇰🇮", "title": "flag: Kiribati" },
            { "emoji": "🇽🇰", "title": "flag: Kosovo" },
            { "emoji": "🇰🇼", "title": "flag: Kuwait" },
            { "emoji": "🇰🇬", "title": "flag: Kyrgyzstan" },
            { "emoji": "🇱🇦", "title": "flag: Laos" },
            { "emoji": "🇱🇻", "title": "flag: Latvia" },
            { "emoji": "🇱🇧", "title": "flag: Lebanon" },
            { "emoji": "🇱🇸", "title": "flag: Lesotho" },
            { "emoji": "🇱🇷", "title": "flag: Liberia" },
            { "emoji": "🇱🇾", "title": "flag: Libya" },
            { "emoji": "🇱🇮", "title": "flag: Liechtenstein" },
            { "emoji": "🇱🇹", "title": "flag: Lithuania" },
            { "emoji": "🇱🇺", "title": "flag: Luxembourg" },
            { "emoji": "🇲🇴", "title": "flag: Macao SAR China" },
            { "emoji": "🇲🇬", "title": "flag: Madagascar" },
            { "emoji": "🇲🇼", "title": "flag: Malawi" },
            { "emoji": "🇲🇾", "title": "flag: Malaysia" },
            { "emoji": "🇲🇻", "title": "flag: Maldives" },
            { "emoji": "🇲🇱", "title": "flag: Mali" },
            { "emoji": "🇲🇹", "title": "flag: Malta" },
            { "emoji": "🇲🇭", "title": "flag: Marshall Islands" },
            { "emoji": "🇲🇶", "title": "flag: Martinique" },
            { "emoji": "🇲🇷", "title": "flag: Mauritania" },
            { "emoji": "🇲🇺", "title": "flag: Mauritius" },
            { "emoji": "🇾🇹", "title": "flag: Mayotte" },
            { "emoji": "🇲🇽", "title": "flag: Mexico" },
            { "emoji": "🇫🇲", "title": "flag: Micronesia" },
            { "emoji": "🇲🇩", "title": "flag: Moldova" },
            { "emoji": "🇲🇨", "title": "flag: Monaco" },
            { "emoji": "🇲🇳", "title": "flag: Mongolia" },
            { "emoji": "🇲🇪", "title": "flag: Montenegro" },
            { "emoji": "🇲🇸", "title": "flag: Montserrat" },
            { "emoji": "🇲🇦", "title": "flag: Morocco" },
            { "emoji": "🇲🇿", "title": "flag: Mozambique" },
            { "emoji": "🇲🇲", "title": "flag: Myanmar (Burma)" },
            { "emoji": "🇳🇦", "title": "flag: Namibia" },
            { "emoji": "🇳🇷", "title": "flag: Nauru" },
            { "emoji": "🇳🇵", "title": "flag: Nepal" },
            { "emoji": "🇳🇱", "title": "flag: Netherlands" },
            { "emoji": "🇳🇨", "title": "flag: New Caledonia" },
            { "emoji": "🇳🇿", "title": "flag: New Zealand" },
            { "emoji": "🇳🇮", "title": "flag: Nicaragua" },
            { "emoji": "🇳🇪", "title": "flag: Niger" },
            { "emoji": "🇳🇬", "title": "flag: Nigeria" },
            { "emoji": "🇳🇺", "title": "flag: Niue" },
            { "emoji": "🇳🇫", "title": "flag: Norfolk Island" },
            { "emoji": "🇰🇵", "title": "flag: North Korea" },
            { "emoji": "🇲🇰", "title": "flag: North Macedonia" },
            { "emoji": "🇲🇵", "title": "flag: Northern Mariana Islands" },
            { "emoji": "🇳🇴", "title": "flag: Norway" },
            { "emoji": "🇴🇲", "title": "flag: Oman" },
            { "emoji": "🇵🇰", "title": "flag: Pakistan" },
            { "emoji": "🇵🇼", "title": "flag: Palau" },
            { "emoji": "🇵🇸", "title": "flag: Palestinian Territories" },
            { "emoji": "🇵🇦", "title": "flag: Panama" },
            { "emoji": "🇵🇬", "title": "flag: Papua New Guinea" },
            { "emoji": "🇵🇾", "title": "flag: Paraguay" },
            { "emoji": "🇵🇪", "title": "flag: Peru" },
            { "emoji": "🇵🇭", "title": "flag: Philippines" },
            { "emoji": "🇵🇳", "title": "flag: Pitcairn Islands" },
            { "emoji": "🇵🇱", "title": "flag: Poland" },
            { "emoji": "🇵🇹", "title": "flag: Portugal" },
            { "emoji": "🇵🇷", "title": "flag: Puerto Rico" },
            { "emoji": "🇶🇦", "title": "flag: Qatar" },
            { "emoji": "🇷🇪", "title": "flag: Réunion" },
            { "emoji": "🇷🇴", "title": "flag: Romania" },
            { "emoji": "🇷🇺", "title": "flag: Russia" },
            { "emoji": "🇷🇼", "title": "flag: Rwanda" },
            { "emoji": "🇼🇸", "title": "flag: Samoa" },
            { "emoji": "🇸🇲", "title": "flag: San Marino" },
            { "emoji": "🇸🇹", "title": "flag: São Tomé & Príncipe" },
            { "emoji": "🇸🇦", "title": "flag: Saudi Arabia" },
            { "emoji": "🇸🇳", "title": "flag: Senegal" },
            { "emoji": "🇷🇸", "title": "flag: Serbia" },
            { "emoji": "🇸🇨", "title": "flag: Seychelles" },
            { "emoji": "🇸🇱", "title": "flag: Sierra Leone" },
            { "emoji": "🇸🇬", "title": "flag: Singapore" },
            { "emoji": "🇸🇽", "title": "flag: Sint Maarten" },
            { "emoji": "🇸🇰", "title": "flag: Slovakia" },
            { "emoji": "🇸🇮", "title": "flag: Slovenia" },
            { "emoji": "🇬🇸", "title": "flag: South Georgia & South Sandwich Islands" },
            { "emoji": "🇸🇧", "title": "flag: Solomon Islands" },
            { "emoji": "🇸🇴", "title": "flag: Somalia" },
            { "emoji": "🇿🇦", "title": "flag: South Africa" },
            { "emoji": "🇰🇷", "title": "flag: South Korea" },
            { "emoji": "🇸🇸", "title": "flag: South Sudan" },
            { "emoji": "🇪🇸", "title": "flag: Spain" },
            { "emoji": "🇱🇰", "title": "flag: Sri Lanka" },
            { "emoji": "🇧🇱", "title": "flag: St. Barthélemy" },
            { "emoji": "🇸🇭", "title": "flag: St. Helena" },
            { "emoji": "🇰🇳", "title": "flag: St. Kitts & Nevis" },
            { "emoji": "🇱🇨", "title": "flag: St. Lucia" },
            { "emoji": "🇵🇲", "title": "flag: St. Pierre & Miquelon" },
            { "emoji": "🇻🇨", "title": "flag: St. Vincent & Grenadines" },
            { "emoji": "🇸🇩", "title": "flag: Sudan" },
            { "emoji": "🇸🇷", "title": "flag: Suriname" },
            { "emoji": "🇸🇪", "title": "flag: Sweden" },
            { "emoji": "🇨🇭", "title": "flag: Switzerland" },
            { "emoji": "🇸🇾", "title": "flag: Syria" },
            { "emoji": "🇹🇼", "title": "flag: Taiwan" },
            { "emoji": "🇹🇯", "title": "flag: Tajikistan" },
            { "emoji": "🇹🇿", "title": "flag: Tanzania" },
            { "emoji": "🇹🇭", "title": "flag: Thailand" },
            { "emoji": "🇹🇱", "title": "flag: Timor-Leste" },
            { "emoji": "🇹🇬", "title": "flag: Togo" },
            { "emoji": "🇹🇰", "title": "flag: Tokelau" },
            { "emoji": "🇹🇴", "title": "flag: Tonga" },
            { "emoji": "🇹🇹", "title": "flag: Trinidad & Tobago" },
            { "emoji": "🇹🇦", "title": "flag: Tristan da Cunha" },
            { "emoji": "🇹🇳", "title": "flag: Tunisia" },
            { "emoji": "🇹🇷", "title": "flag: Turkey" },
            { "emoji": "🇹🇲", "title": "flag: Turkmenistan" },
            { "emoji": "🇹🇨", "title": "flag: Turks & Caicos Islands" },
            { "emoji": "🇹🇻", "title": "flag: Tuvalu" },
            { "emoji": "🇻🇮", "title": "flag: U.S. Virgin Islands" },
            { "emoji": "🇺🇬", "title": "flag: Uganda" },
            { "emoji": "🇺🇦", "title": "flag: Ukraine" },
            { "emoji": "🇦🇪", "title": "flag: United Arab Emirates" },
            { "emoji": "🇬🇧", "title": "flag: United Kingdom" },
            { "emoji": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "title": "flag: England" },
            { "emoji": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "title": "flag: Scotland" },
            { "emoji": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "title": "flag: Wales" },
            { "emoji": "🇺🇸", "title": "flag: United States" },
            { "emoji": "🇺🇾", "title": "flag: Uruguay" },
            { "emoji": "🇺🇿", "title": "flag: Uzbekistan" },
            { "emoji": "🇻🇺", "title": "flag: Vanuatu" },
            { "emoji": "🇻🇦", "title": "flag: Vatican City" },
            { "emoji": "🇻🇪", "title": "flag: Venezuela" },
            { "emoji": "🇻🇳", "title": "flag: Vietnam" },
            { "emoji": "🇼🇫", "title": "flag: Wallis & Futuna" },
            { "emoji": "🇪🇭", "title": "flag: Western Sahara" },
            { "emoji": "🇾🇪", "title": "flag: Yemen" },
            { "emoji": "🇿🇲", "title": "flag: Zambia" },
            { "emoji": "🇿🇼", "title": "flag: Zimbabwe" },
        ]
    }
    

    const categoryFlags = {
        'smile-people': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"><path d="M2255 5108 c-461 -52 -936 -253 -1309 -553 -120 -96 -343 -326 -433 -446 -210 -280 -361 -598 -443 -931 -57 -233 -65 -308 -65 -618 0 -310 8 -385 65 -618 67 -271 197 -570 346 -792 426 -637 1084 -1044 1834 -1136 185 -22 552 -15 726 15 232 40 432 100 639 192 126 57 294 150 317 176 54 62 68 166 31 238 -38 73 -93 105 -182 105 -51 0 -70 -6 -133 -40 -270 -149 -534 -239 -805 -275 -135 -18 -409 -20 -528 -5 -272 35 -494 102 -730 223 -611 311 -1022 870 -1152 1567 -25 136 -25 564 0 700 131 699 541 1255 1155 1569 216 110 442 181 686 216 144 21 425 21 576 0 525 -74 1018 -345 1352 -745 250 -299 412 -645 483 -1035 22 -119 31 -461 16 -591 -27 -224 -96 -469 -188 -665 -47 -100 -73 -146 -157 -283 -32 -53 -36 -68 -36 -125 0 -124 77 -201 201 -201 96 0 137 30 215 156 181 292 292 587 355 941 30 168 38 535 15 723 -57 466 -244 916 -533 1283 -73 93 -327 347 -420 420 -364 287 -815 475 -1273 532 -137 17 -489 19 -625 3z"/> <path d="M1528 3521 c-209 -67 -348 -255 -348 -469 0 -93 28 -148 94 -187 63 -37 155 -36 217 3 52 33 85 92 94 166 9 65 39 96 95 96 56 0 86 -31 95 -96 9 -74 42 -133 94 -166 62 -39 154 -40 217 -3 66 39 94 94 94 187 0 215 -141 404 -349 468 -83 26 -223 26 -303 1z"/> <path d="M3298 3521 c-209 -67 -348 -255 -348 -469 0 -93 28 -148 94 -187 63 -37 155 -36 217 3 52 33 85 92 94 166 9 65 39 96 95 96 56 0 86 -31 95 -96 9 -74 42 -133 94 -166 62 -39 154 -40 217 -3 66 39 94 94 94 187 0 215 -141 404 -349 468 -83 26 -223 26 -303 1z"/> <path d="M1253 2234 c-93 -55 -124 -182 -69 -281 46 -82 138 -203 224 -294 233 -247 511 -404 842 -476 130 -28 489 -26 620 4 426 96 809 372 1034 747 31 52 36 68 36 125 0 123 -77 201 -200 201 -91 0 -129 -25 -200 -130 -200 -295 -473 -486 -782 -545 -108 -21 -308 -21 -416 0 -306 59 -586 253 -782 545 -71 106 -109 130 -201 130 -51 0 -73 -6 -106 -26z"/></g></svg>',
        'animal-nature': '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"><path d="M1670 4745 c-192 -53 -360 -213 -456 -434 -107 -248 -122 -576 -38 -841 106 -338 341 -550 609 -552 98 0 161 14 241 53 327 161 508 639 419 1106 -61 320 -248 572 -490 657 -69 25 -215 30 -285 11z"/> <path d="M3235 4753 c-235 -52 -425 -245 -521 -527 -143 -418 -27 -945 259 -1176 115 -93 222 -132 362 -132 268 2 503 214 609 552 84 265 69 593 -38 841 -97 224 -268 385 -461 434 -55 14 -165 18 -210 8z"/> <path d="M370 3381 c-89 -29 -141 -60 -200 -120 -64 -65 -108 -145 -142 -251 -19 -63 -23 -96 -22 -205 1 -152 23 -252 83 -380 49 -101 83 -151 156 -226 354 -361 853 -174 894 336 17 211 -39 414 -165 591 -148 210 -407 319 -604 255z"/> <path d="M4527 3390 c-124 -21 -291 -136 -381 -264 -226 -318 -228 -739 -5 -972 101 -104 219 -151 359 -141 171 12 349 123 463 289 47 68 103 196 128 288 33 124 33 315 1 420 -34 106 -78 186 -142 251 -111 113 -255 157 -423 129z"/> <path d="M2380 2844 c-160 -29 -258 -59 -385 -117 -472 -215 -886 -701 -1063 -1247 -46 -143 -66 -235 -81 -372 -31 -278 12 -454 143 -583 111 -109 231 -153 446 -162 150 -6 261 7 665 76 456 78 438 78 945 -9 337 -58 497 -75 640 -67 364 20 565 202 587 532 10 166 -21 376 -89 585 -177 546 -592 1033 -1063 1247 -201 92 -303 114 -535 118 -102 2 -196 1 -210 -1z"/></g></svg>',
        'food-drink': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 295 295" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 295 295"> <g> <path d="M25,226.011v16.511c0,8.836,7.465,16.489,16.302,16.489h214.063c8.837,0,15.636-7.653,15.636-16.489v-16.511H25z"/> <path d="m271.83,153.011c-3.635-66-57.634-117.022-123.496-117.022-65.863,0-119.863,51.021-123.498,117.022h246.994zm-198.497-50.99c-4.557,0-8.25-3.693-8.25-8.25 0-4.557 3.693-8.25 8.25-8.25 4.557,0 8.25,3.693 8.25,8.25 0,4.557-3.693,8.25-8.25,8.25zm42,33c-4.557,0-8.25-3.693-8.25-8.25 0-4.557 3.693-8.25 8.25-8.25 4.557,0 8.25,3.693 8.25,8.25 0,4.557-3.693,8.25-8.25,8.25zm33.248-58c-4.557,0-8.25-3.693-8.25-8.25 0-4.557 3.693-8.25 8.25-8.25 4.557,0 8.25,3.693 8.25,8.25 0,4.557-3.693,8.25-8.25,8.25zm32.752,58c-4.557,0-8.25-3.693-8.25-8.25 0-4.557 3.693-8.25 8.25-8.25 4.557,0 8.25,3.693 8.25,8.25 0,4.557-3.693,8.25-8.25,8.25zm50.25-41.25c0,4.557-3.693,8.25-8.25,8.25-4.557,0-8.25-3.693-8.25-8.25 0-4.557 3.693-8.25 8.25-8.25 4.557,0 8.25,3.694 8.25,8.25z"/> <path d="m275.414,169.011h-0.081-254.825c-11.142,0-20.508,8.778-20.508,19.921v0.414c0,11.143 9.366,20.665 20.508,20.665h254.906c11.142,0 19.586-9.523 19.586-20.665v-0.414c0-11.143-8.444-19.921-19.586-19.921z"/> </g> </svg>',
        'activity': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"><path d="M2360 4954 c-357 -42 -598 -111 -873 -251 -115 -59 -297 -176 -377 -243 l-49 -41 87 -78 c252 -227 425 -447 556 -708 l56 -111 89 -4 c99 -3 127 -16 169 -78 26 -39 30 -106 7 -149 -21 -42 -71 -80 -114 -87 l-38 -6 24 -97 c26 -111 53 -280 53 -340 l0 -41 62 0 c71 0 132 -25 163 -68 15 -20 20 -43 20 -92 0 -49 -5 -72 -20 -92 -31 -43 -92 -68 -163 -68 l-62 0 0 -40 c0 -58 -28 -236 -54 -344 l-23 -94 38 -6 c43 -7 93 -45 114 -87 23 -43 19 -110 -7 -149 -42 -62 -70 -75 -168 -78 l-89 -4 -58 -116 c-126 -255 -329 -519 -542 -707 -50 -43 -91 -82 -91 -85 1 -3 29 -26 63 -51 203 -152 443 -278 670 -354 742 -248 1571 -116 2177 345 l82 62 -39 31 c-80 63 -312 306 -383 402 -87 116 -185 276 -241 391 l-39 82 -89 3 c-99 4 -127 17 -168 79 -27 39 -31 106 -8 149 21 42 71 80 114 87 l38 6 -23 94 c-26 107 -54 286 -54 343 l0 39 -74 4 c-56 2 -82 9 -103 24 -98 73 -98 195 0 268 21 15 47 22 103 24 l74 4 0 39 c0 57 28 236 54 343 l23 94 -38 6 c-43 7 -93 45 -114 87 -23 43 -19 110 8 149 42 62 69 75 168 79 l90 3 50 101 c133 264 301 482 537 694 54 48 98 90 100 94 2 3 -25 29 -60 56 -305 242 -688 407 -1088 468 -100 15 -462 28 -540 19z"/> <path d="M778 4142 c-252 -266 -462 -662 -552 -1037 -174 -735 14 -1509 509 -2093 l87 -102 51 42 c184 151 372 376 490 585 l35 61 -34 6 c-39 8 -89 47 -109 87 -23 43 -19 110 8 149 43 63 68 75 177 78 l98 4 22 80 c25 95 56 249 65 334 l7 62 -66 4 c-106 7 -161 60 -161 158 0 97 55 151 160 158 49 3 65 8 65 19 0 46 -35 243 -60 342 -17 63 -30 115 -30 117 0 1 -45 4 -99 6 -110 3 -135 15 -178 78 -27 39 -31 106 -8 149 20 40 70 79 109 87 l34 6 -35 61 c-111 197 -278 397 -474 568 l-56 49 -55 -58z"/> <path d="M4174 4091 c-115 -104 -215 -214 -301 -331 -45 -60 -143 -219 -143 -231 0 -4 14 -10 30 -14 17 -4 44 -18 61 -32 85 -72 79 -188 -14 -257 -23 -17 -46 -22 -128 -24 -54 -2 -99 -5 -99 -6 0 -2 -13 -54 -30 -117 -25 -99 -60 -296 -60 -342 0 -11 16 -16 65 -19 105 -7 160 -61 160 -158 0 -97 -55 -151 -160 -158 -49 -3 -65 -8 -65 -19 0 -46 35 -243 60 -342 17 -63 30 -116 30 -117 0 -2 38 -4 85 -4 98 0 139 -14 178 -59 72 -86 29 -224 -78 -253 l-42 -11 34 -61 c117 -207 311 -438 490 -584 l51 -42 87 102 c299 354 479 756 552 1228 24 158 24 491 0 650 -54 356 -180 687 -371 972 -68 103 -220 295 -258 326 -13 10 -34 -5 -134 -97z"/></g></svg>',
        'travel-places': '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="465.000000pt" height="465.000000pt" viewBox="0 0 465.000000 465.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,465.000000) scale(0.100000,-0.100000)"><path d="M2435 4549 c-116 -14 -292 -55 -409 -96 -107 -37 -326 -138 -326 -151 0 -4 128 -135 285 -292 l284 -284 218 106 c379 184 774 329 1106 404 42 10 77 21 77 24 0 9 -133 84 -230 128 -144 67 -302 115 -485 148 -109 19 -408 27 -520 13z"/> <path d="M3815 3960 c-401 -84 -859 -246 -1239 -437 l-68 -34 28 -30 c26 -27 950 -950 959 -958 16 -14 229 475 314 722 73 211 165 566 186 720 7 45 6 47 -16 46 -13 0 -87 -13 -164 -29z"/> <path d="M4255 3618 c-11 -64 -98 -367 -145 -503 -71 -204 -157 -411 -268 -638 l-106 -218 284 -284 c157 -157 288 -285 292 -285 13 0 114 219 151 326 160 462 136 976 -65 1414 -46 101 -119 230 -129 230 -4 0 -10 -19 -14 -42z"/> <path d="M1978 2193 l-678 -678 -292 291 c-263 261 -300 293 -358 319 -57 26 -77 30 -160 30 -86 0 -101 -3 -162 -32 -93 -44 -151 -100 -196 -191 -35 -72 -37 -81 -37 -171 0 -84 4 -104 29 -161 27 -60 65 -100 475 -513 418 -419 451 -450 520 -485 l75 -37 168 -4 168 -3 0 -135 c0 -169 10 -203 75 -268 102 -103 243 -101 338 5 57 64 67 101 67 264 l0 136 720 0 720 0 0 -136 c0 -170 9 -204 75 -269 102 -103 243 -101 338 5 57 64 67 102 67 263 l0 135 168 3 168 4 76 37 c91 45 147 103 191 196 29 61 32 76 32 163 0 90 -2 99 -37 171 -45 91 -103 147 -196 191 l-67 32 -1335 3 -1335 2 645 645 645 645 -110 110 c-60 60 -112 110 -115 110 -3 0 -310 -305 -682 -677z"/> <path d="M303 518 c-217 -219 -224 -230 -208 -315 9 -49 69 -109 118 -118 85 -16 96 -9 317 211 l205 204 -110 110 c-60 60 -112 110 -115 110 -3 0 -96 -91 -207 -202z"/></g></svg>',
        'objects': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"><path d="M2370 5110 c-198 -25 -375 -77 -544 -162 -627 -312 -992 -998 -901 -1691 50 -379 195 -672 485 -980 128 -137 194 -227 255 -346 47 -94 99 -253 116 -353 l13 -78 308 0 308 0 0 508 0 507 -281 420 c-154 231 -289 437 -300 457 -25 49 -24 94 4 142 25 45 77 76 125 76 58 0 104 -33 155 -109 l47 -70 52 24 c29 13 111 54 181 90 92 47 139 65 167 65 28 0 86 -24 219 -90 l181 -90 47 71 c51 76 97 109 155 109 48 0 100 -31 125 -76 28 -48 29 -93 4 -142 -11 -20 -146 -226 -300 -457 l-281 -420 0 -507 0 -508 304 0 303 0 7 65 c16 159 106 377 215 521 32 44 109 131 171 194 249 255 385 497 458 815 170 736 -196 1509 -873 1845 -243 121 -433 169 -695 175 -85 2 -189 0 -230 -5z"/> <path d="M2443 3232 l-113 -57 110 -165 c60 -91 114 -166 118 -168 7 -2 99 131 216 310 l18 27 -111 56 c-61 30 -114 55 -118 54 -5 0 -59 -26 -120 -57z"/> <path d="M1810 977 l0 -223 -33 -12 c-18 -7 -46 -25 -62 -42 -23 -24 -29 -41 -33 -87 -3 -48 0 -64 20 -93 29 -43 80 -70 132 -70 32 0 37 3 31 17 -20 47 -46 155 -52 216 l-6 67 753 0 753 0 -6 -67 c-6 -61 -32 -169 -52 -216 -6 -15 -1 -17 46 -17 31 0 69 7 89 18 126 63 97 256 -42 278 l-38 7 0 223 0 224 -750 0 -750 0 0 -223z"/> <path d="M1880 438 c0 -26 92 -157 152 -215 155 -154 314 -218 533 -217 214 1 366 63 519 212 58 56 137 166 150 210 l7 22 -680 0 c-512 0 -681 -3 -681 -12z"/></g></svg>',
        'symbols': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"><path d="M2445 5054 c-881 -51 -1644 -528 -2062 -1289 -193 -350 -290 -711 -300 -1115 -7 -281 15 -482 83 -726 244 -891 941 -1566 1839 -1779 196 -47 314 -60 560 -60 301 0 491 29 760 115 184 59 427 173 533 249 156 114 106 371 -82 422 -71 19 -122 6 -276 -74 -219 -114 -391 -171 -635 -214 -139 -23 -471 -23 -610 0 -439 76 -798 259 -1106 566 -769 766 -784 2005 -35 2789 537 562 1337 763 2071 521 308 -102 579 -272 805 -505 167 -173 270 -319 370 -526 207 -430 254 -910 134 -1374 -37 -146 -61 -199 -115 -259 -183 -200 -519 -124 -600 136 -18 58 -19 102 -19 841 0 584 -3 791 -12 822 -26 86 -136 166 -228 166 -115 0 -240 -116 -240 -223 0 -13 -18 -5 -71 29 -296 192 -674 244 -1009 138 -190 -59 -339 -151 -486 -298 -163 -162 -262 -335 -322 -559 -25 -94 -27 -116 -26 -292 0 -172 3 -199 26 -285 151 -559 652 -933 1213 -906 274 13 513 105 731 281 l31 25 38 -64 c84 -144 251 -285 408 -346 202 -79 427 -77 629 4 184 75 346 231 432 418 57 123 118 359 148 568 17 122 17 505 0 625 -70 488 -241 892 -533 1254 -397 495 -993 828 -1614 905 -129 16 -333 25 -430 20z m247 -1788 c102 -20 175 -49 260 -105 101 -66 196 -172 247 -274 61 -124 76 -190 75 -337 -1 -107 -5 -137 -27 -205 -38 -115 -90 -198 -182 -290 -92 -92 -175 -144 -290 -182 -68 -22 -98 -26 -205 -27 -147 -1 -213 14 -337 75 -145 72 -287 228 -343 377 -77 204 -59 439 47 622 47 80 178 213 256 259 152 89 328 120 499 87z"/></g></svg>',
        'flags': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"><path d="M4255 5006 c-204 -208 -399 -316 -686 -380 -261 -58 -568 -60 -1104 -7 -170 17 -404 36 -519 43 -593 32 -1000 -83 -1307 -370 l-72 -68 21 -64 c12 -36 175 -616 363 -1290 188 -674 343 -1227 344 -1228 2 -2 44 31 94 75 201 175 418 276 711 330 79 15 149 18 410 17 267 0 354 -4 575 -27 143 -15 318 -32 390 -37 192 -16 529 -14 666 4 349 47 616 174 843 400 95 95 124 139 132 198 11 83 7 88 -133 163 -250 133 -497 302 -731 501 -62 53 -115 106 -118 119 -3 12 17 114 45 226 97 396 173 780 227 1157 19 134 34 268 32 296 -3 51 -3 51 -38 53 -32 1 -44 -7 -145 -111z"/> <path d="M152 4245 c-97 -30 -151 -104 -152 -204 0 -42 126 -506 541 -1990 297 -1065 548 -1951 556 -1969 26 -54 77 -82 149 -82 159 0 274 80 274 191 0 35 -1083 3917 -1105 3959 -21 41 -81 87 -131 99 -54 14 -78 13 -132 -4z"/></g></svg>'
    };

    

    const icons = {
        search: '<svg style="fill: #646772;" version="1.1" width="17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 487.95 487.95" style="enable-background:new 0 0 487.95 487.95;" xml:space="preserve"> <g> <g> <path d="M481.8,453l-140-140.1c27.6-33.1,44.2-75.4,44.2-121.6C386,85.9,299.5,0.2,193.1,0.2S0,86,0,191.4s86.5,191.1,192.9,191.1 c45.2,0,86.8-15.5,119.8-41.4l140.5,140.5c8.2,8.2,20.4,8.2,28.6,0C490,473.4,490,461.2,481.8,453z M41,191.4 c0-82.8,68.2-150.1,151.9-150.1s151.9,67.3,151.9,150.1s-68.2,150.1-151.9,150.1S41,274.1,41,191.4z"/> </g> </g> <g> </g> <g> </g> </svg>',
    }

    const functions = {

        styles: () => {
            // index 0 -> original
            // index 1 -> design for node-red style
            const indexActiveStyle = 1;
            const navStyles = [{
                fgEmojiContainer: {
                    svg: {
                        height: "15px",
                        width: "15px"
                    }
                },
                fgEmojiNav: {
                    backgroundColor: "#646772",
                    li: {
                        a: {
                            svg: {
                                fill: "white"
                            }
                        }
                    },
                    liHover: {
                        a: {
                            svg: {
                                fill: "black"
                            }
                        }
                    },
                    ul: {
                        li: {
                            aHover: {
                                backgroundColor: "#e9ebf1"
                            }
                        },
                        liActive: {
                            a: {
                                backgroundColor: "#e9ebf1"
                            }
                        },
                        liEmojiPickerNavActive: {
                            a: {
                                backgroundColor: "#e9ebf1",
                                svg: {
                                    fill: "#646772"
                                }
                            }
                        }
                    }
                },
                fgEmojiList: {
                    li: {
                        aHover: {
                            backgroundColor: "#ebebeb"
                        }
                    }
                },
                bottomTriangle: {
                    fill: "#646772"
                }
            }, {
                fgEmojiContainer: {
                    svg: {
                        height: "18px",
                        width: "18px"
                    }
                },
                fgEmojiNav: {
                    backgroundColor: "var(--red-ui-workspace-button-background)",
                    li: {
                        a: {
                            svg: {
                                fill: "var(--red-ui-workspace-button-color)"
                            }
                        }
                    },
                    liHover: {
                        a: {
                            svg: {
                                fill: "var(--red-ui-workspace-button-color-hover)"
                            }
                        }
                    },
                    ul: {
                        li: {
                            aHover: {
                                // backgroundColor: "var(--red-ui-workspace-button-background-primary)"
                                backgroundColor: "var(--red-ui-workspace-button-background-hover)"
                            }
                        },
                        liActive: {
                            a: {
                                backgroundColor: "var(--red-ui-workspace-button-color-primary)"
                            }
                        },
                        liEmojiPickerNavActive: {
                            a: {
                                backgroundColor: "var(--red-ui-workspace-button-background-primary)",
                                svg: {
                                    fill: "var(--red-ui-workspace-button-color-primary)"
                                }
                            }
                        }
                    }
                },
                fgEmojiList: {
                    li: {
                        aHover: {
                            backgroundColor: "var(--red-ui-workspace-button-background-primary)"
                        }
                    }
                },
                bottomTriangle: {
                    fill: "var(--red-ui-workspace-button-background)"
                }
            }];

            const styles = `
                    <style>
                        .fg-emoji-container {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: ${pickerWidth}px;
                            height: ${pickerHeight}px;
                            border-top-left-radius: 6px;
                            border-top-right-radius: 6px;
                            border-bottom-left-radius: 6px;
                            box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
                            background-color: white;
                            overflow: hidden;
                            z-index: 9999;
                        }

                        .fg-emoji-container svg {
                            max-width: 100%;
                            box-sizing: border-box;
                            width: ${navStyles[indexActiveStyle].fgEmojiContainer.svg.width};
                            height: ${navStyles[indexActiveStyle].fgEmojiContainer.svg.height};
                        }

                        .fg-emoji-picker-category-title {
                            display: block;
                            margin: 10px 0 0 0;
                            padding: 0 10px 5px 10px;
                            font-size: 14px;
                            font-family: sans-serif;
                            font-weight: bold;
                            flex: 0 0 calc(100% - 20px);
                            border-bottom: 1px solid #ededed;
                        }

                        .fg-emoji-nav {
                            background-color: ${navStyles[indexActiveStyle].fgEmojiNav.backgroundColor};
                        }

                        .fg-emoji-nav li a svg {
                            transition: all .2s ease;
                            fill: ${navStyles[indexActiveStyle].fgEmojiNav.li.a.svg.fill};
                        }

                        .fg-emoji-nav li:hover a svg {
                            fill: ${navStyles[indexActiveStyle].fgEmojiNav.liHover.a.svg.fill};
                        }

                        .fg-emoji-nav ul {
                            display: flex;
                            flex-wrap: wrap;
                            list-style: none;
                            margin: 0;
                            padding: 0;
                        }

                        .fg-emoji-nav ul li {
                            flex: 1;
                        }

                        .fg-emoji-nav ul li a {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 40px;
                            transition: all .2s ease;
                        }

                        .fg-emoji-nav ul li a:hover {
                            background-color: ${navStyles[indexActiveStyle].fgEmojiNav.ul.li.aHover.backgroundColor};
                        }

                        .fg-emoji-nav ul li.active a {
                            background-color: ${navStyles[indexActiveStyle].fgEmojiNav.ul.liActive.a.backgroundColor};
                        }

                        .fg-emoji-nav ul li.emoji-picker-nav-active a {
                            background-color: ${navStyles[indexActiveStyle].fgEmojiNav.ul.liEmojiPickerNavActive.a.backgroundColor};
                        }

                        .fg-emoji-nav ul li.emoji-picker-nav-active a svg {
                            fill: ${navStyles[indexActiveStyle].fgEmojiNav.ul.liEmojiPickerNavActive.a.svg.fill};
                        }

                        .fg-emoji-list {
                            list-style: none;
                            margin: 0;
                            padding: 0;
                            overflow-y: scroll;
                            overflow-x: hidden;
                            height: 274px;
                        }

                        .fg-emoji-picker-category-wrapper {
                            display: flex;
                            flex-wrap: wrap;
                            flex: 1;
                        }

                        .fg-emoji-list li {
                            position: relative;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: center;
                            align-items: center;
                            flex: 0 0 calc(100% / 6);
                            height: 36px;
                        }

                        .fg-emoji-list li a {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            text-decoration: none;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: center;
                            align-items: center;
                            font-size: 18px;
                            background-color: #ffffff;
                            border-radius: 3px;
                            transition: all .3s ease;
                        }
                        
                        .fg-emoji-list li a:hover {
                            background-color: ${navStyles[indexActiveStyle].fgEmojiList.li.aHover.backgroundColor};
                        }

                        .fg-emoji-picker-search {
                            position: relative;
                        }

                        .fg-emoji-picker-search input {
                            border: none;
                            box-shadow: 0 0 0 0;
                            outline: none;
                            width: calc(100% - 30px);
                            display: block;
                            padding: 10px 15px;
                            background-color: #f3f3f3;
                        }

                        .fg-emoji-picker-search .fg-emoji-picker-search-icon {
                            position: absolute;
                            right: 0;
                            top: 0;
                            width: 40px;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .bottom-triangle {
                            position: absolute;
                            fill: ${navStyles[indexActiveStyle].bottomTriangle.fill};
                            transform: matrix(-1, 0, 0, 1, 0, 0);
                            z-index: 9999;
                            /* filter: drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.72)); 
                        }

                    </style>
                `;

            document.head.insertAdjacentHTML('beforeend', styles);
        },


        position: () => {
            // Gathering element width
            const elementWidth = elementTarget.offsetWidth;
            // Finding position x and y
            const offset = { x: 0, y: 0 };
            while (elementTarget) {
                offset.x += elementTarget.offsetLeft;
                offset.y += elementTarget.offsetTop;
                elementTarget = elementTarget.offsetParent;
            }
            if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
                offset.x -= document.documentElement.scrollLeft;
                offset.y -= document.documentElement.scrollTop;
            } else if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
                offset.x -= document.body.scrollLeft;
                offset.y -= document.body.scrollTop;
            } else if (window.pageXOffset || window.pageYOffset) {
                offset.x -= window.pageXOffset;
                offset.y -= window.pageYOffset;
            }

            const pickerLeft = offset.x - pickerWidth + (elementWidth / 2) + moreDistanceX;
            const pickerTop = offset.y - pickerHeight - moreDistanceY;
            const triangleLeft = pickerLeft + pickerWidth - triangleWidth;
            const triangleTop = pickerTop + pickerHeight;
            return {
                picker: {
                    left: pickerLeft,
                    top: pickerTop
                },
                triangle: {
                    left: triangleLeft,
                    top: triangleTop
                }
            };
        },

        rePositioning: (picker) => {
            picker.getBoundingClientRect().right > window.screen.availWidth ? picker.style.left = window.screen.availWidth - picker.offsetWidth + 'px' : false;

            if (window.innerHeight > pickerHeight) {
                picker.getBoundingClientRect().bottom > window.innerHeight ? picker.style.top = window.innerHeight - picker.offsetHeight + 'px' : false;
            }
        },

        render: (e, attr) => {
            if (!pickerShowState) {
                pickerShowState = true;

                emojiList = undefined;
                const index = this.options.trigger.findIndex(item => item.selector === attr);
                this.insertInto = this.options.trigger[index].insertInto;
                callbackSetSelectorColor(true);

                const position = functions.position();

                if (!emojiesHTML.length) {
                    for (const key in emojiObj) {
                        if (emojiObj.hasOwnProperty.call(emojiObj, key)) {
                            const categoryObj = emojiObj[key];

                            categoriesHTML += `<li><a title="${key}" href="#${key}">${categoryFlags[key]}</a></li>`;

                            emojiesHTML += `<div class="fg-emoji-picker-category-wrapper" id="${key}">`;
                            emojiesHTML += `<p class="fg-emoji-picker-category-title">${key}</p>`;
                            categoryObj.forEach(ej => {
                                emojiesHTML += `<li data-title="${ej.title.toLowerCase()}"><a title="${ej.title}" href="#">${ej.emoji}</a></li>`;
                            });
                            emojiesHTML += '</div>';
                        }
                    }
                }

                if (document.querySelector('.fg-emoji-container')) {
                    // callbackSetSelectorColor(false);
                    this.lib('.fg-emoji-container').remove();
                    this.lib('.bottom-triangle').remove();
                }

                const picker = `
                        <div class="fg-emoji-container" style="left: ${position.picker.left}px; top: ${position.picker.top}px;">
                            <div class="fg-emoji-picker-search">
                                <input type="text" placeholder="Search" />
                                
                                <span class="fg-emoji-picker-search-icon">${icons.search}</sapn>
                            </div>
                            <div>
                                <!--<div class="fg-emoji-picker-loader-animation">
                                    <div class="spinner">
                                        <div class="bounce1"></div>
                                        <div class="bounce2"></div>
                                        <div class="bounce3"></div>
                                    </div>
                                </div>-->
    
                                <ul class="fg-emoji-list">
                                    ${emojiesHTML}
                                </ul>
                            </div>
                            <nav class="fg-emoji-nav">
                                <ul>
                                    ${categoriesHTML}
                                </ul>
                            </nav>
                        </div>
                        <svg height="12" viewBox="0 0 21 12" width="21" class="bottom-triangle" style="transform: scale(-1, 1) translate(0px); left: ${position.triangle.left}px; top: ${position.triangle.top}px;"><path d="M20.685.12c-2.229.424-4.278 1.914-6.181 3.403L5.4 10.94c-2.026 2.291-5.434.62-5.4-2.648V.12h20.684z"></path></svg>
                    `;

                document.body.insertAdjacentHTML('beforeend', picker);

                functions.rePositioning(document.querySelector('.fg-emoji-container'));

                setTimeout(() => {
                    if (document.querySelector('.fg-emoji-picker-search input') != null) {
                        document.querySelector('.fg-emoji-picker-search input').focus();
                    }
                }, 500);
            } else {
                functions.closePicker.call(this, e);
            }
        },

        closePicker: (e) => {
            e.preventDefault();
            callbackSetSelectorColor(false);
            this.lib('.fg-emoji-container').remove();
            this.lib('.bottom-triangle').remove();
            pickerShowState = false;
        },

        checkPickerExist(e) {
            if (document.querySelector('.fg-emoji-container') && !e.target.closest('.fg-emoji-container') && !e.target.closest(targetClass)) {
                functions.closePicker.call(this, e);
            }
        },

        setCaretPosition: (field, caretPos) => {
            let elem = field
            if (elem != null) {
                if (elem.createTextRange) {
                    let range = elem.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                } else {
                    if (elem.selectionStart) {
                        elem.focus();
                        elem.setSelectionRange(caretPos, caretPos);
                    } else {
                        elem.focus();
                    }
                }
            }
        },

        insert: e => {
            e.preventDefault();

            const emoji = e.target.innerText.trim();
            const myField = document.querySelectorAll(this.insertInto);
            const myValue = emoji;

            // Check if selector is an array
            myField.forEach(myField => {
                if (document.selection) {
                    myField.focus();
                    sel = document.selection.createRange();
                    sel.text = myValue;
                } else if (myField.selectionStart || myField.selectionStart == "0") {
                    const startPos = myField.selectionStart;
                    const endPos = myField.selectionEnd;
                    myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

                    functions.setCaretPosition(myField, startPos + 2)

                } else {
                    myField.value += myValue;
                    myField.focus()
                }

            })
        },

        categoryNav: e => {
            e.preventDefault();

            const link = e.target.closest('a');

            if (link.getAttribute('id') && link.getAttribute('id') === 'fg-emoji-picker-close-button') return false;

            const id = link.getAttribute('href');
            const emojiBody = document.querySelector('.fg-emoji-list');
            const destination = emojiBody.querySelector(`${id}`);

            this.lib('.fg-emoji-nav li').removeClass('emoji-picker-nav-active');
            link.closest('li').classList.add('emoji-picker-nav-active');

            destination.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        },

        search: e => {
            const val = e.target.value.trim();

            if (!emojiList) {
                emojiList = Array.from(document.querySelectorAll('.fg-emoji-picker-category-wrapper li'));
            }

            emojiList.filter(emoji => {
                if (!emoji.getAttribute('data-title').match(val)) {
                    emoji.style.display = 'none'
                } else {
                    emoji.style.display = ''
                }
            })
        }
    };

    const bindEvents = () => {
        this.lib(document.body).on('click', functions.closePicker, '#fg-emoji-picker-close-button');
        this.lib(document.body).on('click', functions.checkPickerExist);
        this.lib(document.body).on('click', functions.render, this.trigger);
        this.lib(document.body).on('click', functions.insert, '.fg-emoji-list a');
        this.lib(document.body).on('click', functions.categoryNav, '.fg-emoji-nav a');
        this.lib(document.body).on('input', functions.search, '.fg-emoji-picker-search input');
    };

    (() => {
        // Start styles
        functions.styles();

        // Event functions
        bindEvents.call(this);
    })()
};