import { test, expect } from '@playwright/test';


const BASE_URL = 'https://restful-booker.herokuapp.com';


test.describe('Booking API', { tag: ['@booker', '@api'] }, () => {


  test('POST /auth', { tag: ['@auth', '@post'] }, async ({ request }) => {
    let responseBody: { token: string };

    await test.step('Отправка запроса авторизации', async () => {
      const response = await request.post(`${BASE_URL}/auth`, {
        data: {
          username: 'admin',
          password: 'password123',
        },
      });

      expect(response.ok()).toBe(true);
      expect(response.status()).toBe(200);

      responseBody = await response.json();
    });

    await test.step('Проверка токена в ответе', async () => {
      expect(responseBody.token).toBeDefined();
      expect(responseBody.token).not.toBeNull();
      expect(responseBody.token).not.toBe('');

    });
  });


  test('GET /booking', { tag: '@get' }, async ({ request }) => {
    let responseBody: { bookingid: number }[];

    await test.step('Получение списка бронирований', async () => {
      const response = await request.get(`${BASE_URL}/booking`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      responseBody = await response.json();
    });

    await test.step('Проверка идентификаторов бронирований', async () => {
     
      console.log(responseBody.length);
      
      for (const booking of responseBody) {
        expect(booking.bookingid).toBeGreaterThan(0);
        expect(typeof booking.bookingid).toBe('number');
        expect(booking.bookingid).toBeDefined();
        expect(booking.bookingid).not.toBeNull();
      }
    });
  });


  test('GET /booking/{id}', { tag: '@get' }, async ({ request }) => {
    let responseBody: {
      firstname: string;
      lastname: string;
      totalprice: number;
      depositpaid: boolean;
      bookingdates: { checkin: string; checkout: string };
      additionalneeds?: string;
    };

    await test.step('Получение бронирования по id', async () => {
      const response = await request.get(`${BASE_URL}/booking/1`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      responseBody = await response.json();
    });

    await test.step('Проверка полей бронирования', async () => {
      expect(responseBody.firstname).toBeDefined();
      expect(responseBody.lastname).toBeDefined();
      expect(responseBody.totalprice).toBeDefined();
      expect(responseBody.depositpaid).toBeDefined();
      expect(responseBody.bookingdates).toBeDefined();
      expect(responseBody.bookingdates.checkin).toBeDefined();
      expect(responseBody.bookingdates.checkout).toBeDefined();

      if (responseBody.additionalneeds) {
        expect(responseBody.additionalneeds.length).toBeGreaterThan(0);
      }
    });
  });


  test('POST /booking', { tag: '@post' }, async ({ request }) => {
    let responseBody: { bookingid: number; booking: { firstname: string } };

    await test.step('Создание нового бронирования', async () => {
      const response = await request.post(`${BASE_URL}/booking`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          firstname: 'Jim',
          lastname: 'Brown',
          totalprice: 111,
          depositpaid: true,
          bookingdates: {
            checkin: '2026-01-01',
            checkout: '2026-01-02',
          },
          additionalneeds: 'Breakfast',
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      responseBody = await response.json();
    });

    await test.step('Проверка созданного бронирования', async () => {
      expect(responseBody.bookingid).toBeDefined();
      expect(responseBody.bookingid).not.toBeNull();
      expect(responseBody.booking).toBeDefined();
      expect(responseBody.booking.firstname).toBe('Jim');
    });
  });


  test('PUT /booking/{id}', { tag: ['@auth', '@put'] }, async ({ request }) => {
    let authToken: string;

    const updatedBooking = {
      firstname: 'James',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01',
      },
      additionalneeds: 'Breakfast',
    };

    await test.step('Авторизация и получение токена', async () => {
      const authResponse = await request.post(`${BASE_URL}/auth`, {
        data: {
          username: 'admin',
          password: 'password123',
        },
      });

      expect(authResponse.ok()).toBeTruthy();
      expect(authResponse.status()).toBe(200);

      const authResponseBody = await authResponse.json();
      expect(authResponseBody.token).toBeDefined();
      expect(authResponseBody.token).not.toBeNull();
      expect(authResponseBody.token).not.toBe('');

      authToken = authResponseBody.token;
    });

    await test.step('Полное обновление бронирования', async () => {
      const response = await request.put(`${BASE_URL}/booking/1`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Cookie: `token=${authToken}`,
        },
        data: updatedBooking,
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.firstname).toBe(updatedBooking.firstname);
      expect(responseBody.lastname).toBe(updatedBooking.lastname);
      expect(responseBody.totalprice).toBe(updatedBooking.totalprice);
      expect(responseBody.depositpaid).toBe(updatedBooking.depositpaid);
      expect(responseBody.bookingdates.checkin).toBe(
        updatedBooking.bookingdates.checkin,
      );
      expect(responseBody.bookingdates.checkout).toBe(
        updatedBooking.bookingdates.checkout,
      );
      expect(responseBody.additionalneeds).toBe(updatedBooking.additionalneeds);
    });
  });


  test('PATCH /booking/{id}', { tag: ['@auth', '@patch'] }, async ({ request }) => {
    let authToken: string;

    const partialUpdate = {
      firstname: 'James',
      lastname: 'Brown',
    };

    await test.step('Авторизация и получение токена', async () => {
      const authResponse = await request.post(`${BASE_URL}/auth`, {
        data: {
          username: 'admin',
          password: 'password123',
        },
      });

      expect(authResponse.ok()).toBeTruthy();
      expect(authResponse.status()).toBe(200);

      const authResponseBody = await authResponse.json();
      expect(authResponseBody.token).toBeDefined();
      expect(authResponseBody.token).not.toBeNull();
      expect(authResponseBody.token).not.toBe('');

      authToken = authResponseBody.token;
    });

    await test.step('Частичное обновление бронирования', async () => {
      const response = await request.patch(`${BASE_URL}/booking/1`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Cookie: `token=${authToken}`,
        },
        data: partialUpdate,
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.firstname).toBe(partialUpdate.firstname);
      expect(responseBody.lastname).toBe(partialUpdate.lastname);
      expect(responseBody.totalprice).toBeDefined();
    });
  });


  test('DELETE /booking/{id}', { tag: ['@auth', '@delete'] }, async ({ request }) => {
    let authToken: string;
    let bookingId: number;

    await test.step('Авторизация и получение токена', async () => {
      const authResponse = await request.post(`${BASE_URL}/auth`, {
        data: {
          username: 'admin',
          password: 'password123',
        },
      });

      expect(authResponse.ok()).toBeTruthy();
      expect(authResponse.status()).toBe(200);

      const authResponseBody = await authResponse.json();
      expect(authResponseBody.token).toBeDefined();
      expect(authResponseBody.token).not.toBeNull();
      expect(authResponseBody.token).not.toBe('');

      authToken = authResponseBody.token;
    });

    await test.step('Создание бронирования для удаления', async () => {
      const createResponse = await request.post(`${BASE_URL}/booking`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          firstname: 'Delete',
          lastname: 'Test',
          totalprice: 100,
          depositpaid: true,
          bookingdates: {
            checkin: '2026-06-01',
            checkout: '2026-06-02',
          },
        },
      });

      expect(createResponse.ok()).toBeTruthy();
      const createResponseBody = await createResponse.json();
      bookingId = createResponseBody.bookingid;
    });

    await test.step('Удаление бронирования', async () => {
      const response = await request.delete(`${BASE_URL}/booking/${bookingId}`, {
        headers: {
          Cookie: `token=${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(201);
      expect(await response.text()).toBe('Created');
    });

    await test.step('Проверка, что бронирование удалено', async () => {
      const getResponse = await request.get(`${BASE_URL}/booking/${bookingId}`);
      expect(getResponse.status()).toBe(404);
    });
  });


});


// npx playwright test --grep "@booker"
// npx playwright test --grep "@auth"
// npx playwright test --grep "@get"
// npx playwright test --grep "@posts"