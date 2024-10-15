
var eventCurrentSlide = 1;
var eventSlideLength;
var eventPrevSlide = 0;
var eventsIndexPrototype;


(async () => {
    var events = await new BeeStore({ path: "Events" }).getQuerySnapshot({ field: "timeStamp", type: "isGreaterThan", value: 0, end: 3 });
    if (events !== null && Object.entries(events).length != 0) {
        var animatedEventsImage = document.getElementById('animated_images_event');
        var animatedEventsBody = document.getElementById('animated_event_body');
        var animatedEventsIndex = document.getElementById('animated_images_index');

        for (let index = 0; index < events.length; index++) {
            const element = events[index];
            var img = `<div class="home" id="event" style="margin-top: 0px; display: inline;position: absolute; left: 0px; right: 0px; background-image: url('${element.coverImage}');">
                <div class="spacer"></div> 
              </div>`;
            var body = `<div class="event__data" id="event_body" style="position: absolute;">
              <h1 class="home__title" style="margin-bottom: 0px;"><span class="home__title-color" , style="color: black;">${element.title ?? ""}</span><br></h1>
              <div style="font-weight: 200; color: black;">${element.subTitle ?? ""}</div>
              <p style="font-weight: 400; color: black;">${element.date ?? ""}</p><br>
              
          </div>`

            animatedEventsImage.innerHTML += img;
            animatedEventsBody.innerHTML += body;
        }

        for (let index = 0; index < events.length; index++) {
            const element = events[index];
            var item = `<div class="gray"; style="margin-bottom: 5px; margin-top: 5px; width: .25rem; height: 2.5rem; border-radius: 8px;"></div>`;
            animatedEventsIndex.innerHTML += item;
        }
        var eventsIndexPrototype = Array.prototype.slice.call(animatedEventsIndex.children);
        var eventsImgPrototype = Array.prototype.slice.call(animatedEventsImage.children);
        var eventsBodyPrototype = Array.prototype.slice.call(animatedEventsBody.children);
        eventsImgPrototype.map(function (imgObj) {
            imgObj.classList.add("slide_animated_images-img");
        });
        eventsBodyPrototype.map(function (imgObj) {
            imgObj.classList.add("slide_animated_images-img");
        });
        eventsImgPrototype[0].classList.add("slide");
        eventsBodyPrototype[0].classList.add("slide");
        eventsIndexPrototype[0].classList.add("dark");
        eventSlideLength = animatedEventsImage.children.length;


        setInterval(function () {
            if (eventCurrentSlide >= eventSlideLength)
                eventCurrentSlide = 0;
            eventsIndexPrototype[eventPrevSlide].classList.remove("dark");
            eventsIndexPrototype[eventCurrentSlide].classList.add("dark");
            eventsBodyPrototype[eventPrevSlide].classList.remove("slide");
            eventsBodyPrototype[eventCurrentSlide].classList.add("slide");
            eventsImgPrototype[eventPrevSlide].classList.remove("slide");
            eventsImgPrototype[eventCurrentSlide].classList.add("slide");
            eventPrevSlide = eventCurrentSlide;
            eventCurrentSlide++;
        }, 4000);

    }

    var trend = null
        trend = await new BeeStore({ path: "Trend/data" }).getDoc();
    
    if (trend !== null) {
        var animatedImage = document.getElementById('animated_images');
        var images = trend.images ?? [];
        for (let index = 0; index < images.length; index++) {
            const image = images[index];
            var item = `<img src="${image}" alt="" class="image-container${index == 0 ? " show" : ""}">`;
            animatedImage.innerHTML += item;
        }

        var arr = Array.prototype.slice.call(animatedImage.children);

        arr.map(function (imgObj) {
            imgObj.classList.add("animated_images-img");
        });
        arr[0].classList.add("show");
        var currentSlide = 1;
        var slideLength = animatedImage.children.length;
        var prevSlide = 0;

        setInterval(function () {
            if (currentSlide >= slideLength)
                currentSlide = 0;

            arr[prevSlide].classList.remove("show");
            arr[currentSlide].classList.add("show");

            prevSlide = currentSlide;
            currentSlide++;

        }, 3000);

        var animatedTxt = document.getElementById('animated_txt');
        var title = `<h2 class="section-subtitle">${trend.title ?? ""}</h2>`;
        animatedTxt.innerHTML += title;

        var subTitle = `<div style="display: flex;margin-top: 2rem;">
               <img src="./assets/icons/qoute.png" alt="quote png" width="30px" height="30px"
                   style="height: min-content; margin-right: 10px;">
               <p class="about__text" style="text-align: justify;margin-right: 1rem;">${trend.subTitle ?? ""}
               </p>
           </div>`;
        animatedTxt.innerHTML += subTitle;
        if (trend.href != null) {
            var button = `<a href="./Trend/${trend.href}" class="button" style="margin-left: 70px; margin-top: 20px">READ MORE</a>`;
            animatedTxt.innerHTML += button;
        }

    }
    
    var news = await new BeeStore({ path: "News" }).getQuerySnapshot({ field: "timeStamp", type: "isGreaterThan", value: 0, end: 3 });
       
    if (news !== null && Object.entries(news).length != 0) {
        var topFeeds = document.getElementById('top_feeds');
        var feeds = document.getElementById('feeds');
        news.forEach(element => {
                var item = `
                <a href="${element.href ?? "#"}"><div style="display: grid;"><h6 class="news__subtitle" style="color: black; font-size: var(--normal-font-size); padding-left: 15px;padding-right: 15px; margin-top: 15px;">${element.title ?? ""}</h6><p style="padding-left: 15px; padding-right: 15px; color: gray; text-overflow: ellipsis; height: 100px; overflow: hidden;">${element.subTitle ?? ""}</p></div></a>`
                topFeeds.innerHTML += item;

                var topItem = `<div class="work__img" padding-bottom: 20px;><img src="${element.coverImage}"/> <h3 class="news__subtitle" style= "padding-left: 15px; padding-right: 15px;">${element.title ?? ""}</h3> <p class="news__text" style="max-lines: 3; padding-left: 15px; padding-right: 15px; color: gray; text-overflow: ellipsis;">${element.subTitle ?? ""}</p> <div class="news__text" style="color: black; margin-top: 15px;margin-bottom: 20px;"><a href="${element.href ?? "#"}" style= "padding-left: 15px; padding-right: 15px;">READ MORE</a></div> </div>`;
                feeds.innerHTML += topItem;
        });
    }


    var media =  await new BeeStore({ path: "Medias" }).getQuerySnapshot({field: "timeStamp",type: "isGreaterThan", value: 0, end: 4 });
    if (media !== null && Object.entries(media).length != 0) {
        var b = document.getElementById('media');

        media.forEach(element => {
            if (element.href !== null) {
                var item = `<iframe style="border-radius: 20px;" src="${element.href}"
                        title="${element.title}" frameborder="0"
                        loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"allowfullscreen></iframe>`;
                b.innerHTML += item
            }
        });

    }
})()
