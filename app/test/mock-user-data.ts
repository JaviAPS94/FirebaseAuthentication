export const mockUsers = {
  users: [
    {
      name: "inmedical",
      secret: "$2b$10$PcLrSk9Zs68OLep33x9XQePze7wp.U.SeKXxkGkwFlK7U2TzuUbzC",
      additionalInfo: {
        "account": 10,
        "country": 1,
        "useExternalIds": true
      }
    },
    {
      name: "sesat",
      secret: "$2b$10$PcLrSk9Zs68OLep33x9XQePze7wp.U.SeKXxkGkwFlK7U2TzuUbzC",
      additionalInfo: {
        "account": 10,
        "country": 1,
        "useExternalIds": true
      }
    }
  ],
  usersResult: [
    {
      name: "inmedical",
      additionalInfo: {
        "account": 10,
        "country": 1,
        "useExternalIds": true
      }
    },
    {
      name: "sesat",
      additionalInfo: {
        "account": 10,
        "country": 1,
        "useExternalIds": true
      }
    }
  ],
  usersLogin: [
    {
      client_id: "4",
      client_secret: "inmedical.dev@2020",
      grant_type: "client_credentials"
    }
  ],
  usersCreate: [
    {
      name: "inmedical",
      secret: "inmedical.dev@2020",
      additionalInfo: {
        "account": 10,
        "country": 1,
        "useExternalIds": true
      }
    }
  ]
};