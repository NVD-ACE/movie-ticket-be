import { Movie } from "../models/index.js";
import { Category } from "../models/index.js";
import { Op } from "sequelize";
const createMovie = async (req, res) => {
  const {
    title,
    description,
    releaseDate,
    genre,
    posterUrl,
    cast,
    rating,
    CategoryId,
  } = req.body;
  // rating is optional, so we can set a default value if not provided
  const movieData = {
    title,
    description,
    releaseDate,
    genre,
    posterUrl,
    cast,
    rating: rating || 0, // default to 0 if not provided
  };
  // Validate required fields
  if (!title || !releaseDate) {
    return res
      .status(400)
      .json({ message: "Title and release date are required" });
  }
  // Validate that the category exists
  if (!req.body.CategoryId) {
    return res.status(400).json({ message: "CategoryId is required" });
  }
  if (CategoryId) {
    const category = await Category.findByPk(CategoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    movieData.CategoryId = CategoryId;
  }
  // Create the movie
  try {
    // Check if a movie with the same title already exists
    const existingMovie = await Movie.findOne({ where: { title } });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie already exists" });
    }
    const movie = await Movie.create(movieData);
    res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// const getMovies = async (req, res) => {
//   try {
//     const movies = await Movie.findAll();
//     res.status(200).json(movies);
//   } catch (error) {
//     console.error("Error fetching movies:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const getMovies = async (req, res) => {
  try {
    // Lấy query parameters cho pagination và search
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const genre = req.query.genre || "";
    const categoryId = req.query.categoryId || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "DESC";

    // Tạo điều kiện tìm kiếm
    const whereConditions = {};

    // Tìm kiếm theo title hoặc description
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { cast: { [Op.like]: `%${search}%` } }
      ];
    }

    // Lọc theo genre
    if (genre) {
      whereConditions.genre = { [Op.like]: `%${genre}%` };
    }

    // Lọc theo category
    if (categoryId) {
      whereConditions.CategoryId = categoryId;
    }

    // Tạo điều kiện include cho Category
    const includeOptions = [
      {
        model: Category,
        as: 'Category', // Đảm bảo alias này khớp với association trong model
        attributes: ['id', 'name'] // Chỉ lấy những field cần thiết
      }
    ];

    // Validate sortBy field
    const allowedSortFields = ['title', 'releaseDate', 'rating', 'createdAt', 'updatedAt'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Thực hiện query với pagination
    const { count, rows: movies } = await Movie.findAndCountAll({
      where: whereConditions,
      include: includeOptions,
      limit: limit,
      offset: offset,
      order: [[finalSortBy, finalSortOrder]],
      distinct: true // Để đếm đúng số lượng khi có join
    });

    // Tính toán thông tin pagination
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Trả về kết quả với thông tin pagination
    res.status(200).json({
      success: true,
      data: movies,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage
      },
      filters: {
        search: search,
        genre: genre,
        categoryId: categoryId,
        sortBy: finalSortBy,
        sortOrder: finalSortOrder
      }
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateMovie = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    releaseDate,
    genre,
    posterUrl,
    cast,
    rating,
    CategoryId,
  } = req.body;
  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    // Validate required fields
    if (!title || !description || !releaseDate || !genre || !posterUrl || !cast || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Validate that the movie exists
    const existingMovie = await Movie.findOne({ where: { title: movie.title, id: { [Op.ne]: id } } });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie already exists" });
    }
    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.releaseDate = releaseDate || movie.releaseDate;
    movie.genre = genre || movie.genre;
    movie.posterUrl = posterUrl || movie.posterUrl;
    movie.cast = cast || movie.cast;
    movie.rating = rating || movie.rating;

    if (CategoryId) {
      const category = await Category.findByPk(CategoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      movie.CategoryId = CategoryId;
    }

    await movie.save();
    res.status(200).json(movie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    await movie.destroy();
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const searchMovies = async (req, res) => {
  try {
    const {
      title,
      genre,
      categoryId,
      minRating,
      maxRating,
      releaseYear,
      cast,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC"
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const whereConditions = {};

    // Tìm kiếm theo title
    if (title) {
      whereConditions.title = { [Op.like]: `%${title}%` };
    }

    // Tìm kiếm theo genre
    if (genre) {
      whereConditions.genre = { [Op.like]: `%${genre}%` };
    }

    // Tìm kiếm theo cast
    if (cast) {
      whereConditions.cast = { [Op.like]: `%${cast}%` };
    }

    // Tìm kiếm theo categoryId
    if (categoryId) {
      whereConditions.CategoryId = categoryId;
    }

    // Tìm kiếm theo rating range
    if (minRating || maxRating) {
      whereConditions.rating = {};
      if (minRating) {
        whereConditions.rating[Op.gte] = parseFloat(minRating);
      }
      if (maxRating) {
        whereConditions.rating[Op.lte] = parseFloat(maxRating);
      }
    }

    // Tìm kiếm theo năm phát hành
    if (releaseYear) {
      whereConditions.releaseDate = {
        [Op.and]: [
          { [Op.gte]: new Date(`${releaseYear}-01-01`) },
          { [Op.lt]: new Date(`${parseInt(releaseYear) + 1}-01-01`) }
        ]
      };
    }

    const allowedSortFields = ['title', 'releaseDate', 'rating', 'createdAt'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const { count, rows: movies } = await Movie.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Category,
          as: 'Category',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [[finalSortBy, finalSortOrder]],
      distinct: true
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.status(200).json({
      success: true,
      data: movies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      searchCriteria: {
        title,
        genre,
        categoryId,
        minRating,
        maxRating,
        releaseYear,
        cast,
        sortBy: finalSortBy,
        sortOrder: finalSortOrder
      }
    });
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export { createMovie, getMovies, getMovieById, updateMovie, deleteMovie, searchMovies };
