import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commerceApi } from "@/lib/api/client";
import type { Category, Product, VendorProfile } from "@/types/ecommerce";

interface CatalogState {
  products: Product[];
  categories: Category[];
  vendors: VendorProfile[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CatalogState = {
  products: [],
  categories: [],
  vendors: [],
  status: "idle",
  error: null,
};

export const fetchCatalog = createAsyncThunk(
  "catalog/fetchCatalog",
  async (_: void, { rejectWithValue }) => {
    try {
      const [products, categories, vendors] = await Promise.all([
        commerceApi.getProducts(),
        commerceApi.getCategories(),
        commerceApi.getVendors(),
      ]);

      return { products, categories, vendors };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unable to load catalog.");
    }
  },
);

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.categories = action.payload.categories;
        state.vendors = action.payload.vendors;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Unable to load catalog.";
      });
  },
});

export default catalogSlice.reducer;
