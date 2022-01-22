[
  {
    "$match": {
      "myColor": {
        "$nin": [
          null,
          ""
        ]
      }
    }
  },
  {
    "$group": {
      "_id": {
        "__alias_0": "$gameDate"
      },
      "__alias_1": {
        "$sum": {
          "$cond": [
            {
              "$ne": [
                {
                  "$type": "$gameDate"
                },
                "missing"
              ]
            },
            1,
            0
          ]
        }
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0",
      "__alias_1": 1
    }
  },
  {
    "$project": {
      "value": "$__alias_1",
      "group": "$__alias_0",
      "_id": 0
    }
  },
  {
    "$sort": {
      "group": -1
    }
  },
  {
    "$limit": 50000
  }
]
