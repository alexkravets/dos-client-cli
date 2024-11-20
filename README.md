# dos-client-cli

Add dependencies to React project:

```sh
npm i --save dos-client-cli
npm i --save dos-client
```

Create `client.yaml` configuration file:

```yaml
host: "dev.example.com"

services:
  activities: "/api/activities"

operations:
  - "activities/IndexActivities"
```

Run update command:

```
npx update
```
