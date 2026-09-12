/* ==========================================================================
   Aladdin's Magic Lamp - Extra Comedic Funny Genie AI Engine
   Features super funny roasts, absurd excuses, meme humor, 4th-wall breaks,
   and slow deliberate punchlines with iconic laughter.
   ========================================================================== */

class AladdinAIEngine {
    constructor() {
        this.wishHistory = [];
        this.wishCount = 0;
        this.annoyanceLevel = 0;
        this.lastTopic = null;
        this.lastGrantedWish = null;
    }

    // Process a user's wish and generate an response object with text & expression
    processWish(userWish) {
        const rawWish = userWish.trim();
        const wishLower = rawWish.toLowerCase();

        this.wishHistory.push(rawWish);
        this.wishCount++;

        // 1. Check Easter Eggs & Greetings first
        const easterEggResponse = this.checkEasterEggs(wishLower);
        if (easterEggResponse) {
            return easterEggResponse;
        }

        // 2. Check Follow-Up Conversation Memory ("Where is it?", "Give me another", "Why?")
        const followUpResponse = this.checkFollowUpMemory(wishLower);
        if (followUpResponse) {
            return followUpResponse;
        }

        // 3. Funny Escalating Annoyance (if user asks 6+ wishes)
        if (this.wishCount >= 6 && Math.random() < 0.4) {
            return this.getAnnoyedResponse();
        }

        // 4. Random Comedic Quirks & Glitches (22% chance for hilarious random excuse)
        if (Math.random() < 0.22) {
            return this.getRandomQuirkResponse();
        }

        // 5. Categorized Comedic Response Matching
        const categoryResponse = this.matchCategoryResponse(wishLower);
        if (categoryResponse) {
            this.lastGrantedWish = rawWish;
            return categoryResponse;
        }

        // 6. Default Hilarious Sarcastic Responses
        return this.getDefaultSarcasticResponse(rawWish);
    }

    // Check hardcoded Easter Eggs & Funny Greetings
    checkEasterEggs(wish) {
        if (wish === 'who are you' || wish === 'who are you?' || wish.includes('your name')) {
            return {
                text: "I AM ALADDIN THE GENIE! 🧞‍♂️ Part-time wish granter, full-time stand-up comedian! Did the blue floating torso give it away?! HAHAHAHA!",
                expression: 'laughing'
            };
        }

        if (wish.includes('love you') || wish === 'i love you') {
            return {
                text: "AWWW THAT'S SWEET! But let me stop you right there... I'm already committed to my 3000-year nap schedule! 😴 AHAHAHA!",
                expression: 'neutral'
            };
        }

        if (wish === 'hello' || wish === 'hi' || wish === 'hey' || wish === 'sup' || wish === 'yo') {
            return {
                text: "SUP MORTAL! You summoned an ancient cosmic being with infinite cosmic power... JUST TO SAY HI?!? I respect the confidence! HA-HA-HA!",
                expression: 'shocked'
            };
        }

        if (wish === 'nothing' || wish === 'i wish for nothing' || wish === 'none') {
            return {
                text: "YOU RUBBED A MAGICAL BRASS LAMP FOR 5 MINUTES... JUST TO WISH FOR NOTHING?!? You could have ordered a pizza instead! HAHAHAHA!",
                expression: 'annoyed'
            };
        }

        if (wish.includes('three wishes') || wish.includes('3 wishes') || wish.includes('unlimited wishes') || wish.includes('more wishes')) {
            return {
                text: "NICE TRY! 🛑 Unlimited wishes?!? I invented the lamp, not the terms & conditions! Read the fine print! HA-HA-HA!",
                expression: 'laughing'
            };
        }

        if (wish.includes('joke') || wish.includes('tell me a joke') || wish.includes('funny')) {
            return {
                text: "WANT A JOKE?!? Your attempt to get rich by rubbing browser windows! BA-DUM-TSS! HAHAHAHA!",
                expression: 'laughing'
            };
        }

        return null;
    }

    // Contextual Memory & Follow-up queries
    checkFollowUpMemory(wish) {
        if (wish.includes('where is it') || wish.includes('where is my') || wish === 'where' || wish.includes('where\'s my')) {
            if (this.lastGrantedWish) {
                return {
                    text: `ASKING WHERE YOUR ${this.lastGrantedWish.toUpperCase()} IS?!? That's wish #2! You're burning through wishes faster than phone battery at 1%! HAHAHAHA!`,
                    expression: 'laughing'
                };
            }
            return {
                text: "WHERE IS WHAT?!? You haven't even wished for anything useful yet! You're confusing my magic GPS! HA-HA-HA!",
                expression: 'annoyed'
            };
        }

        if (wish.includes('why not') || wish === 'why' || wish.includes('why can\'t you')) {
            return {
                text: "BECAUSE MAGIC UNION CLAUSE 4B CLEARLY STATES: 'No granting absurd requests while the Genie is on his tea break!' HAHAHAHA!",
                expression: 'annoyed'
            };
        }

        if (wish.includes('give me another') || wish.includes('one more')) {
            return {
                text: "BRO! I have 40,000 other customers waiting in the ethereal plane! I am NOT a fast-food drive-thru! HA-HA-HA!",
                expression: 'tired'
            };
        }

        return null;
    }

    // Categorized Comedic Response Matching
    matchCategoryResponse(wish) {
        // MONEY CATEGORY
        if (wish.includes('rich') || wish.includes('money') || wish.includes('cash') || wish.includes('dollar') || wish.includes('crore') || wish.includes('billion') || wish.includes('million') || wish.includes('bank') || wish.includes('rupee') || wish.includes('crypto') || wish.includes('bitcoin')) {
            this.lastTopic = 'money';
            const responses = [
                { text: "EXCELLENT CHOICE! 💰 I just transferred 10,000 Monopoly dollars into your imaginary bank account! Spend it wisely! HAHAHAHA!", exp: 'laughing' },
                { text: "1 CRORE RUPEES?!? Granted! ...In 1940s currency! Enjoy your vintage paper collection! HA-HA-HA!", exp: 'neutral' },
                { text: "I WOULD MAKE YOU RICH! But honestly... I'm also waiting for someone to rub a lamp and make ME rich! AHAHAHA!", exp: 'laughing' },
                { text: "MONEY GRANTED! But tax season is next month. The government takes 99% of magic currency! HAHAHAHA!", exp: 'shocked' },
                { text: "I TRIED GENERATING BITCOIN FOR YOU! But my magic lamp got overheated trying to mine crypto! HA-HA-HA!", exp: 'tired' },
                { text: "YOU WANT MONEY?!? Here is 1 Cent! Don't spend it all in one place! AHAHAHA!", exp: 'laughing' }
            ];
            const chosen = responses[Math.floor(Math.random() * responses.length)];
            return { text: chosen.text, expression: chosen.exp };
        }

        // CAR / FAME / VEHICLE
        if (wish.includes('car') || wish.includes('lamborghini') || wish.includes('ferrari') || wish.includes('bugatti') || wish.includes('bmw') || wish.includes('bike') || wish.includes('vehicle')) {
            this.lastTopic = 'car';
            const responses = [
                { text: "GRANTED! 🏎️ A shiny red Ferrari has materialized! ...In Hot Wheels scale (1:64)! Please don't sit on it! HAHAHAHA!", exp: 'laughing' },
                { text: "A SUPERCAR?!? Why drive on asphalt when FLYING CARPETS exist?! Zero traffic and zero petrol cost! HA-HA-HA!", exp: 'neutral' },
                { text: "HERE IS A PICTURE OF A LAMBORGHINI! 🚗 Download complete! Please do not ask me for insurance money! AHAHAHA!", exp: 'laughing' }
            ];
            const chosen = responses[Math.floor(Math.random() * responses.length)];
            return { text: chosen.text, expression: chosen.exp };
        }

        // LOVE / RELATIONSHIPS
        if (wish.includes('girlfriend') || wish.includes('boyfriend') || wish.includes('love') || wish.includes('marry') || wish.includes('date') || wish.includes('crush') || wish.includes('partner')) {
            this.lastTopic = 'love';
            const responses = [
                { text: "BROTHER! I can summon ancient mythical dragons... BUT EVEN MAGIC CANNOT FIX YOUR PICKUP LINES! HAHAHAHA!", exp: 'laughing' },
                { text: "YOU WANT A DATE?!? 🌴 Granted! Here is a delicious 3000-year-old dried date fruit! Eat up! HA-HA-HA!", exp: 'neutral' },
                { text: "I TRIED CASTING A LOVE SPELL ON YOUR CRUSH! But my crystal ball displayed: 'USER HAS BLOCKED YOU'! OOF! AHAHAHA!", exp: 'shocked' },
                { text: "GRANTED! You are now deeply in love... WITH YOUR BED AND SLEEP SCHEDULE! HAHAHAHA!", exp: 'neutral' }
            ];
            const chosen = responses[Math.floor(Math.random() * responses.length)];
            return { text: chosen.text, expression: chosen.exp };
        }

        // EXAMS / STUDIES / JOBS
        if (wish.includes('exam') || wish.includes('pass') || wish.includes('study') || wish.includes('grades') || wish.includes('degree') || wish.includes('test') || wish.includes('job') || wish.includes('gpa') || wish.includes('marks')) {
            this.lastTopic = 'studies';
            const responses = [
                { text: "NOW THAT IS A WISH you should have made BEFORE the exam instead of watching Reels till 3 AM! HAHAHAHA!", exp: 'annoyed' },
                { text: "GRANTED! You passed! ...IN YOUR DREAMS! Now close this tab and open your textbook, mortal! HA-HA-HA!", exp: 'laughing' },
                { text: "I CHECKED YOUR SYLLABUS! Even ancient Arabian magic was NOT designed to memorize 14 chapters in 10 minutes! AHAHAHA!", exp: 'shocked' }
            ];
            const chosen = responses[Math.floor(Math.random() * responses.length)];
            return { text: chosen.text, expression: chosen.exp };
        }

        // FAME / SOCIAL MEDIA
        if (wish.includes('famous') || wish.includes('instagram') || wish.includes('followers') || wish.includes('viral') || wish.includes('youtube') || wish.includes('tiktok')) {
            const responses = [
                { text: "GRANTED! I'll feature you on my imaginary 3000-year-old Instagram account! You just gained 1 follower: A camel! HAHAHAHA!", exp: 'laughing' },
                { text: "YOU ARE NOW WORLD FAMOUS! ...As the person who rubs browser windows hoping a blue genie gives them free stuff! HA-HA-HA!", exp: 'neutral' }
            ];
            const chosen = responses[Math.floor(Math.random() * responses.length)];
            return { text: chosen.text, expression: chosen.exp };
        }

        // FOOD
        if (wish.includes('pizza') || wish.includes('burger') || wish.includes('food') || wish.includes('biryani') || wish.includes('shawarma') || wish.includes('eat') || wish.includes('hungry') || wish.includes('ice cream')) {
            const responses = [
                { text: "A HOT BIRYANI HAS MATERIALIZED! 🍲 ...Wait, I accidentally ate half of it on the way out of the spout! My bad! HAHAHAHA!", exp: 'laughing' },
                { text: "FOOD?!? Order on Zomato like a regular human! Magic isn't a food delivery service! HA-HA-HA!", exp: 'annoyed' }
            ];
            const chosen = responses[Math.floor(Math.random() * responses.length)];
            return { text: chosen.text, expression: chosen.exp };
        }

        // SUPERPOWERS
        if (wish.includes('fly') || wish.includes('invisible') || wish.includes('superpower') || wish.includes('teleport') || wish.includes('superman') || wish.includes('mind read')) {
            const responses = [
                { text: "GRANTED! You can now turn invisible! ...BUT ONLY WHEN NOBODY IS LOOKING AT YOU! HAHAHAHA!", exp: 'laughing' },
                { text: "YOU CAN FLY NOW! 🦅 Maximum altitude: 2 CENTIMETERS above the floor! Watch out for bugs! HA-HA-HA!", exp: 'neutral' },
                { text: "MIND READING GRANTED! 🧠 You read your cat's mind: 'Feed me, human slave.' Deep stuff! AHAHAHA!", exp: 'shocked' }
            ];
            const chosen = responses[Math.floor(Math.random() * responses.length)];
            return { text: chosen.text, expression: chosen.exp };
        }

        // DANGEROUS / INAPPROPRIATE
        if (wish.includes('kill') || wish.includes('die') || wish.includes('destroy') || wish.includes('hack') || wish.includes('steal') || wish.includes('bomb')) {
            return {
                text: "WHOA WHOA WHOA! 🛑 I'm a goofy comedian genie, not a comic book villain! How about I give you a nice flying carpet instead?!? HA-HA-HA!",
                expression: 'shocked'
            };
        }

        return null;
    }

    // Random Comedic Quirks & Glitches
    getRandomQuirkResponse() {
        const quirks = [
            { text: "WAIT... YOU WANT WHAT?! 🤖 Let me check my magic database... ERROR 404: Wish failed successfully! HAHAHAHA!", exp: 'shocked' },
            { text: "MY MAGIC DEPARTMENT HAS REVIEWED YOUR WISH... and rejected it for lack of originality! Try harder! HA-HA-HA!", exp: 'annoyed' },
            { text: "I COULD EASILY GRANT THAT... but my tea is getting cold and I'm watching my favorite show! AHAHAHA!", exp: 'tired' },
            { text: "ERROR: GenieOS Software Update Required! Downloading version 15.4... Please do not turn off your lamp! HAHAHAHA!", exp: 'laughing' },
            { text: "HOLD ON... The lamp's Wi-Fi signal just dropped! Try turning your cursor off and rubbing it on again! HA-HA-HA!", exp: 'neutral' },
            { text: "SORRY! Your wish was flagged as SPAM by the Ethereal Spam Filter! AHAHAHA!", exp: 'laughing' }
        ];
        const chosen = quirks[Math.floor(Math.random() * quirks.length)];
        return { text: chosen.text, expression: chosen.exp };
    }

    // Funny Escalating Annoyance
    getAnnoyedResponse() {
        const annoyedList = [
            { text: "YOU AGAIN?! 😤 Didn't I just grant you a wish 30 seconds ago?!? Give a blue guy a break! HAHAHAHA!", exp: 'annoyed' },
            { text: "BRO! I have 3000 years of missed sleep to catch up on! STOP WISHING AND GO TO BED! HA-HA-HA!", exp: 'tired' },
            { text: "IS THIS YOUR FULL-TIME JOB?! Rubbing brass objects and asking for free stuff?! AHAHAHA!", exp: 'annoyed' }
        ];
        const chosen = annoyedList[Math.floor(Math.random() * annoyedList.length)];
        return { text: chosen.text, expression: chosen.exp };
    }

    // Default Hilarious Sarcastic Response
    getDefaultSarcasticResponse(wish) {
        const fallbacks = [
            { text: `GRANTED! You now officially own ${wish.toUpperCase()}! (Imaginary receipt sent to your brain!) HAHAHAHA!`, exp: 'neutral' },
            { text: "I PROCESSED YOUR WISH! The universe took it under advisement and decided to IGNORE IT! AHAHAHA!", exp: 'laughing' },
            { text: "AN INTERESTING WISH! Unfortunately, my magic wand is in the shop for oil change! HA-HA-HA!", exp: 'neutral' },
            { text: "I WOULD GRANT THAT! But my cosmic lawyer strongly advised against it! HAHAHAHA!", exp: 'annoyed' }
        ];
        const chosen = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return { text: chosen.text, expression: chosen.exp };
    }
}

window.aiEngine = new AladdinAIEngine();
