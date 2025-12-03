// Import database connection from the lib folder
import { db } from "../lib/db.js";

// Function to create a new playlist for a user
export const createPlayList = async (req, res) => {
  try {
    // Extract playlist name and description from request body
    const { name, description } = req.body;
    // Get the logged-in user's ID from the request
    const userId = req.user.id;

    // Create a new playlist in the database with the provided details
    const playList = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });
    // Send success response with the created playlist data
    res.status(200).json({ success: true, message: 'Playlist created successfully', playList, });
  } catch (error) {
    // Log error to console for debugging
    console.error('Error creating playlist:', error);
    // Send error response to the client
    res.status(500).json({ error: 'Failed to create playlist (this playlist allready created)' });
  }
};

// =========================================================================== //


// Function to get all playlists belonging to the logged-in user
export const getPlayAllListDetails = async (req, res) => {
  try {
    // Fetch all playlists for the current user from database
    const playLists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      // Also include all problems that are in each playlist
      include: {
        problems: {
          // Include full problem details for each problem
          include: {
            problem: true,
          },
        },
      }
    });

    // Send success response with all playlists and their problems
    res.status(200).json({ success: true, message: 'Playlist fetched successfully', playLists });
  } catch (error) {
    // Log error to console for debugging
    console.log("Error fetching playlist", error);
    // Send error response to the client
    res.status(500).json({ error: "Failed to fetch playlist" })
  }
};


// =========================================================================== //


// Function to get details of a single specific playlist
export const getPlayListDetails = async (req, res) => {
  // Extract playlist ID from URL parameters
  const { playlistId } = req.params;

  try {
    // Find the specific playlist by ID and ensure it belongs to the logged-in user
    const playList = await db.playlist.findUnique({
      where: { id: playlistId, userId: req.user.id },
      // Include all problems in this playlist
      include: {
        problems: {
          // Include full problem details
          include: {
            problem: true,
          },
        },
      },
    });

    // If playlist doesn't exist or doesn't belong to user, return error
    if (!playList) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Send success response with the playlist details
    res.status(200).json({ success: true, message: "Playlist fetched successfully", playList })
  } catch (error) {
    // Log error to console for debugging
    console.error('Error fetching playlist:', error);
    // Send error response to the client
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
}


// =========================================================================== //


// Function to add one or more problems to a playlist
export const addProblemToPlayList = async (req, res) => {
  // Extract playlist ID from URL parameters
  const { playlistId } = req.params;
  // Extract array of problem IDs from request body
  const { problemIds } = req.body;

  console.log(problemIds);
  try {
    // Check if problemIds is a valid array and not empty
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: 'Invalid or missing problemIds' });
    }

    // Add multiple problems to the playlist in one operation
    const problemsInPlaylist = await db.problemInPlaylist.createMany({
      // Convert each problem ID into a record with playlistId and problemId
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),

    });

    // Send success response with information about added problems
    res.status(201).json({
      success: true,
      message: 'Problems added to playlist successfully',
      problemsInPlaylist,
    });
  } catch (error) {
    // Log error to console for debugging
    console.error('Error adding problems to playlist:', error.message);
    // Send error response to the client
    res.status(500).json({ error: 'Failed to add problems to playlist (this problem allready add in playList)' });
  }

};


// =========================================================================== //


// Function to delete an entire playlist
export const deletePlayList = async (req, res) => {
  // Extract playlist ID from URL parameters
  const { playlistId } = req.params;

  try {
    // Delete the playlist from database by its ID
    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    // Send success response with information about deleted playlist
    res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully',
      deletedPlaylist,
    });
  } catch (error) {
    // Log error to console for debugging
    console.error('Error deleting playlist:', error.message);
    // Send error response to the client
    res.status(500).json({ error: 'Failed to delete playlist' });
  }

};


// =========================================================================== //


// Function to remove one or more problems from a playlist
export const removeProblemFromPlayList = async (req, res) => {

  // Extract playlist ID from URL parameters
  const { playlistId } = req.params;
  // Extract array of problem IDs to remove from request body
  const { problemIds } = req.body;

  try {
    // Check if problemIds is a valid array and not empty
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: 'Invalid or missing problemIds' });
    }

    // Remove multiple problems from the playlist in one operation
    const deletedProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        // Remove only problems whose IDs are in the provided array
        problemId: {
          in: problemIds,
        },
      },
    });

    // Send success response with information about removed problems
    res.status(200).json({
      success: true,
      message: 'Problem removed from playlist successfully',
      deletedProblem,
    });
  } catch (error) {
    // Log error to console for debugging
    console.error('Error removing problem from playlist:', error.message);
    // Send error response to the client
    res.status(500).json({ error: 'Failed to remove problem from playlist' });
  }

};