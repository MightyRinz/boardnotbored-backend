import csv
import os
import psycopg2
from psycopg2.extras import execute_batch
from dotenv import load_dotenv
load_dotenv()


# อ่าน DATABASE_URL จาก .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in environment")

# connect DB
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

rows = []

with open("data/boardgames_ranks.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for r in reader:
        # ข้าม expansion
        if r["is_expansion"] == "1":
            continue

        rows.append((
            int(r["id"]),
            r["name"],
            int(r["yearpublished"]) if r["yearpublished"] else None,
            int(r["rank"]) if r["rank"] else None,
            float(r["bayesaverage"]) if r["bayesaverage"] else None,
            float(r["average"]) if r["average"] else None,
            int(r["usersrated"]) if r["usersrated"] else None,
            False,
            int(r["strategygames_rank"]) if r["strategygames_rank"] else None,
            int(r["partygames_rank"]) if r["partygames_rank"] else None,
            int(r["familygames_rank"]) if r["familygames_rank"] else None,
        ))

sql = """
INSERT INTO "BoardGame"
(
  id,
  name,
  "yearPublished",
  rank,
  "bayesAverage",
  "averageRating",
  "usersRated",
  "isExpansion",
  "strategyRank",
  "partyRank",
  "familyRank"
)
VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
ON CONFLICT (id) DO NOTHING
"""

execute_batch(cur, sql, rows, page_size=1000)
conn.commit()

cur.close()
conn.close()

print(f"Imported {len(rows)} board games")
