(async () => {
    var c =  await new BeeStore({ path: "Documents" }).getQuerySnapshot({field: "timeStamp",type: "isGreaterThan", value: 0, end: 50 });
    const currentLang = document.getElementsByTagName('html')[0].getAttribute('lang')
    if (c !== null && Object.entries(c).length != 0) {
        var b = document.getElementById('documents');

        c.forEach(element => {
            if (element.href !== null) {
                var item = `<div class="card"><div class="icon"><i class="fas fa-file-pdf"></i></div><div class="title">${element.title}</div><a href="${element.href}" class="button">View Document</a></div>`;
                b.innerHTML += item
            }
        });
    }
})()
