import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../supaBaseClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import Filters from "./Filter";
import { IoFilterSharp, IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import "./Products.css";
import { useAppDispatch } from "../redux/index.ts";
import { fetchProducts} from "../redux/slice/Product.ts";
import { RootState } from "../redux/index.ts";

const Productss = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [wishList, setWishList] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const { user, addToCart } = useAuth();
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

   const dispatch = useAppDispatch();
   const { status, products, loading: isLoading } = useSelector(
      (state: RootState) => state.product
    );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && products.length > 0) {
      console.log("steve", products);
      setData(products);
      setFilter(products);
    }
  }, [isLoading, products]);

  const addProduct = async (product) => {
    await addToCart(product);
  };

  const handleWishlistClick = (productID) => {
    setWishList((prev) => ({
      ...prev,
      [productID]: !prev[productID],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filter.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const Loading = () => (
    <>
      {[...Array(9)].map((_, idx) => (
        <div key={idx} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={400} />
        </div>
      ))}
    </>
  );

  const ShowProducts = () => (
    <div className="shopDetailsProducts">
      <div className="shopDetailsProductsContainer">
        {currentPosts.length === 0 ? (
          <div className="text-center">
            <h3 style={{ color: "#333", fontSize: "1.5rem", marginBottom: "10px" }}>
              No products found
            </h3>
            <p style={{ color: "#666", fontSize: "1rem" }}>
              Try changing your filters or search criteria.
            </p>
          </div>
        ) : (
          currentPosts.map((product) => (
            <div key={product.id} className="sdProductContainer">
              <div className="sdProductImages position-relative ">
                {product.sticker && (
                  <div
                    className="position-absolute top-0 end-0 bg-transparent px-4"
                    style={{ zIndex: 1 }}
                  >
                    <img
                      src={`https://fzliiwigydluhgbuvnmr.supabase.co/storage/v1/object/public/sticker/${product.sticker}`}
                      alt="Sticker"
                      style={{ width: "50px", height: "50px", objectFit: "contain" }}
                    />
                  </div>
                )}
                <Link to={"/product/" + product.id}>
                  <img
                    src={`https://fzliiwigydluhgbuvnmr.supabase.co/storage/v1/object/public/productimages/${product.banner_url}`}
                    alt="Product"
                  />
                </Link>
                <h4
                  className="bg-light"
                  onClick={() => {
                    if (!user) {
                      toast.error("Please login to add products to cart.");
                      navigate("/login");
                      return;
                    }
                    toast.success("Added to cart");
                    addProduct(product);
                  }}
                >
                  Add to Cart
                </h4>
              </div>
              <div className="sdProductInfo">
                <div className="sdProductCategoryWishlist">
                  <p>{product.category}</p>
                  <FiHeart
                    onClick={() => handleWishlistClick(product.id)}
                    style={{
                      color: wishList[product.id] ? "red" : "#767676",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div className="sdProductNameInfo">
                  <h5>{product.name.substring(0, 35)}</h5>
                </div>

                <p>$ {product.amount}</p>
                <div className="sdProductRatingReviews">
                  <div className="sdProductRatingStar">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} color="#FEC78A" size={10} />
                    ))}
                  </div>
                  <span>{product.reviews_count}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const handleFilterChange = (filters) => {
    let updatedList = [...data];

    if (filters.brands && filters.brands.length > 0) {
      updatedList = updatedList.filter((item) => filters.brands.includes(item.brand));
    }

    if (filters.category && filters.category.length > 0) {
      updatedList = updatedList.filter((item) => filters.category.includes(item.category));
    }

    if (filters.priceRange && filters.priceRange.length === 2) {
      const [min, max] = filters.priceRange;
      updatedList = updatedList.filter((item) => item.amount >= min && item.amount <= max);
    }

    setFilter(updatedList);
    setCurrentPage(1);
    closeDrawer();
  };

  const handleSearch = (searchValue) => {
    const search = searchValue.toLowerCase().trim();

    if (search === "") {
      setFilter(data);
    } else {
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.brand?.toLowerCase().includes(search) ||
          item.type?.toLowerCase().includes(search) ||
          item.category?.toLowerCase().includes(search)
      );
      setFilter(filtered);
    }

    setCurrentPage(1);
  };

  return (
    <>
      <div className="shopDetails">
        <div className="shopDetailMain">
          <div className="shopDetails__left">
            <Filters onApplyFilters={handleFilterChange} />
          </div>
          <div className="shopDetails__right">
            <div className="shopDetailsSorting">
              <div className="shopDetailsBreadcrumbLink">
                <Link to="/" onClick={scrollToTop}>
                  Home
                </Link>
                &nbsp;/&nbsp;
                <Link to="/shop">The Shop</Link>
              </div>
              <div className="shopDetailsBreadcrumbLink">
                <SearchBar onSearch={handleSearch} />
              </div>

              <div className="filterLeft" onClick={toggleDrawer}>
                <IoFilterSharp style={{ margin: 0 }} />
                <p style={{ margin: 0 }}>Filter</p>
              </div>
              <div className="shopDetailsSort">
                <select name="sort" id="sort">
                  <option value="default">Default Sorting</option>
                  <option value="Featured">Featured</option>
                  <option value="bestSelling">Best Selling</option>
                  <option value="a-z">Alphabetically, A-Z</option>
                  <option value="z-a">Alphabetically, Z-A</option>
                  <option value="lowToHigh">Price, Low to high</option>
                  <option value="highToLow">Price, high to low</option>
                  <option value="oldToNew">Date, old to new</option>
                  <option value="newToOld">Date, new to old</option>
                </select>
                <div className="filterRight" onClick={toggleDrawer}>
                  <div className="filterSeprator"></div>
                  <IoFilterSharp />
                  <p>Filter</p>
                </div>
              </div>
            </div>
            <div className="row">{isLoading ? <Loading /> : <ShowProducts />}</div>
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={filter.length}
              paginate={paginate}
              currentPage={currentPage}
            />
            <div className={`filterDrawer ${isDrawerOpen ? "open" : ""}`}>
              <div className="drawerHeader">
                <p>Filter By</p>
                <IoClose onClick={closeDrawer} className="closeButton" size={26} />
              </div>
              <div className="drawerContent">
                <Filters onApplyFilters={handleFilterChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Productss;
