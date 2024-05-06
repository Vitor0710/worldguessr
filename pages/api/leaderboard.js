import mongoose from 'mongoose';
import User from '../../models/User';

export default async function handler(req, res) {
  const myUsername = req.query.username;
  console.log(myUsername);
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Connect to MongoDB
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
  }

  try {
    // Fetch top 100 users by XP
    const topUsers = await User.find().sort({ totalXp: -1 }).limit(100);

    // Format response data
    const leaderboard = topUsers.map(user => {
      if (!user.username) {
        return null;
      }
      return {
        username: user.username,
        totalXp: user.totalXp,
        createdAt: user.created_at,
        gamesLen: user.games.length,
      };
    }).filter(user => user !== null);

    // find the user's rank
    let myRank = null;
    let myXp = null;
    if(myUsername) {
    const user = await User.findOne({ username: myUsername });
    myXp = user?.totalXp;
    if(myXp) {
    const myRankQuery = await User.find({ totalXp: { $gt: myXp } }).countDocuments();
    myRank = myRankQuery + 1;
    }
    }

    // Return the leaderboard
    return res.status(200).json({ leaderboard, myRank, myXp });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
}
