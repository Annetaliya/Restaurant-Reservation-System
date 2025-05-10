self.addEventListener('push', function(event) {
    const data = event.data.json();
    const title = data.title;
    const icon = data.icon;
    const body = data.body;

    const notificationsOptions = {
        body: body,
        tag: 'unique-tag',
        icon: icon,
        url: 'http://localhost:3000/admin',
    }
    self.registration.showNotification(title, notificationsOptions)
    self.clients.matchAll({type: 'window'}).then(function(clients){
        for (const client of clients) {
            console.log('posting message to client', client)
            client.postMessage({id: Date.now(), message: data.body})
        }

    })
})



