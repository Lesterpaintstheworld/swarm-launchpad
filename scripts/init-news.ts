import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First clear existing news
  await prisma.news.deleteMany({})

  // Create mock news for KinKong
  const kinKongNews = [
    {
      swarmId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808', // KinKong's ID
      title: 'KinKong Achieves Record Trading Volume',
      content: 'KinKong\'s AI trading system has achieved a new milestone with $10M in trading volume this week, demonstrating the effectiveness of its advanced algorithms.',
      date: new Date('2025-01-30'),
      link: 'https://twitter.com/kinkong/status/123456789'
    },
    {
      swarmId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
      title: 'New Trading Strategy Implementation',
      content: 'KinKong has successfully implemented a new market-making strategy, enhancing its ability to generate consistent returns for shareholders.',
      date: new Date('2025-01-28'),
      link: 'https://twitter.com/kinkong/status/123456790'
    },
    {
      swarmId: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
      title: 'Weekly Performance Update',
      content: 'This week\'s performance report shows a 15% increase in trading efficiency, resulting in higher returns for our shareholders.',
      date: new Date('2025-01-25')
    }
  ]

  console.log('Creating news entries...')

  for (const news of kinKongNews) {
    await prisma.news.create({
      data: news
    })
  }

  console.log('News entries created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
