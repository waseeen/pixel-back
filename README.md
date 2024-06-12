# Waseeen's Pixel Battle

Another pixel battle game

This is the backend part of the [Waseeen's Pixel Battle](https://pb.waseeen.ru).

## Configuration

Before running the app, you need to set the following environment variables:

- `PORT`: the URL of the backend server
- `VK_CLIENT_SECRET`: the client sercet of the VK app. Learn more at <https://dev.vk.com/ru/vkid>
- `VK_SERVICE_TOKEN`: the service token of the VK app. Learn more at <https://dev.vk.com/ru/vkid>
- `FRONTEND_URL`: the URL of the frontend part
- `DB_PATH`: the path to the database file
- `WIDTH`: the width of the canvas
- `HEIGHT`: the height of the canvas
- `COOLDOWN`: the cooldown between updating two tiles as same user in milliseconds

## Dependencies

The app uses the following dependencies:

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [TypeORM](https://typeorm.io/)

## Using the app

Before running the app, you need to create a Sqlite database file. It should contain the `Tile` table with the structure, described in `src/database/entity/Tile.entity.ts` and filled with WIDTH _ HEIGHT rows starting from `1` to `WIDTH _ HEIGHT` with the color that you want (I prefer white).

Install the dependencies

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

or

```bash
npm run trun
```

Build the app for production:

```bash
npm run build
```

Run the app:

```bash
npm start
```
