/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "../../../interfaces/ProductInterface";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productApi } from "./product_api";

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const products = await productApi.getAllProducts();
    return products;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch products.";
    return rejectWithValue(errorMessage);
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    const product = await productApi.getProductById(id);
    return product.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch Selected product.";
    return rejectWithValue(errorMessage);
  }
});

export const createProduct = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("products/createProduct", async (productData, { rejectWithValue }) => {
  try {
    const newProduct = await productApi.createProduct(productData);
    return newProduct.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create product.";
    return rejectWithValue(errorMessage);
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; productData: Product },
  { rejectValue: string }
>(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const updatedProduct = await productApi.updateProduct(id, productData);
      return updatedProduct.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update product.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await productApi.deleteProduct(id);
    return id;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete product.";
    return rejectWithValue(errorMessage);
  }
});

const initialState: {
  products: Product[];
  selectedProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
} = {
  products: [],
  selectedProduct: null,
  status: "idle",
  error: null,
};

const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.products = action.payload;
        }
      )
      .addCase(
        fetchProducts.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      )
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = "succeeded";
          state.selectedProduct = action.payload;
        }
      )
      .addCase(
        fetchProductById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      )

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = "succeeded";
          state.products.push(action.payload);
        }
      )
      .addCase(
        createProduct.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      )

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = "succeeded";
          const index = state.products.findIndex(
            (product) => product.id === action.payload.id
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        }
      )
      .addCase(
        updateProduct.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      )

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.products = state.products.filter(
            (product) => product.id !== action.payload
          );
        }
      )
      .addCase(
        deleteProduct.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      );
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
