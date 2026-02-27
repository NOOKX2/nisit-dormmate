# --- Stage 1: Builder ---
FROM oven/bun:1.1 AS builder
WORKDIR /app

# ติดตั้ง Node.js 20 (LTS) แทนการสั่งติดตั้งแบบธรรมดา
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
    
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# คัดลอกไฟล์ตั้งต้น
COPY package.json bun.lock* bun.lockb* ./
COPY prisma ./prisma/

# ลง Library
RUN bun install

# คัดลอกโค้ดและ Generate Prisma
COPY . .
RUN bunx prisma generate
RUN bun run build

# --- Stage 2: Runner ---
FROM oven/bun:1.1-slim AS runner
WORKDIR /app

# ติดตั้ง Node.js 20 ในฝั่ง Runner ด้วยเพื่อให้ Prisma Runtime ทำงานได้
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["bun", "run", "start"]