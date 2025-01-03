import User from '../models/User.js';

export async function selectGenres(req, res) {
  try {
    const userId = req.user.id;
    const { genres } = req.body;

    if (!genres || genres.length < 2 || genres.length > 3) {
      return res.status(400).json({ message: 'You must select 2 to 3 genres.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.favoriteGenres = genres;
    await user.save();

    return res.status(200).json({ message: 'Genres successfully updated.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
}