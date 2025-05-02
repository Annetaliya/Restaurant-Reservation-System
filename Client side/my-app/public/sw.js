self.addEventListener('push', function(event) {
    const data = event.data.json();
    const title = data.title;
    const icon = data.icon;
    const body = data.body;

    const notificationsOptions = {
        body: body,
        tag: 'unique-tag',
        icon: icon,
        url: 'http://localhost:8000',
    }
    self.registration.showNotification(title, notificationsOptions)
})



