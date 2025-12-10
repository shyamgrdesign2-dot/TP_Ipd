import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiWardAndBedManagement from "../../api/services/ipd/ApiWardAndBedManagement";

// Helper function to transform ward data from API to component format
const transformWardData = (ward) => {
  // The new API response uses different field names
  // Map totalRooms/availableRooms/occupiedRooms/blockedRooms to totalBeds/availableBeds/occupiedBeds/blockedBeds
  return {
    id: ward?._id || ward?.id,
    wardName: ward?.wardName || ward?.name || "",
    totalBeds: ward?.totalRooms ?? ward?.totalBeds ?? 0,
    availableBeds: ward?.availableRooms ?? ward?.availableBeds ?? 0,
    occupiedBeds: ward?.occupiedRooms ?? ward?.occupiedBeds ?? 0,
    blockedBeds: ward?.blockedRooms ?? ward?.blockedBeds ?? 0,
    // Also keep the original fields for backward compatibility
    totalRooms: ward?.totalRooms ?? 0,
    availableRooms: ward?.availableRooms ?? 0,
    occupiedRooms: ward?.occupiedRooms ?? 0,
    blockedRooms: ward?.blockedRooms ?? 0,
    rooms: ward?.rooms || [],
    ...ward, // Keep all other properties
  };
};

// Async thunk for fetching all wards
export const fetchAllWards = createAsyncThunk(
  "wardAndBedManagement/fetchAllWards",
  async (
    { search = "", sort = null, page = 1, limit = 10, append = false } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await ApiWardAndBedManagement.getAllWards(
        search,
        sort,
        page,
        limit
      );
      // New API response structure: { wards: [], pagination: {} }
      const data = response?.data || response;
      return {
        wards: data?.wards || [],
        pagination: data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        append, // Flag to indicate if we should append or replace
        search, // Store search query to detect changes
      };
    } catch (error) {
      console.error("Error fetching all wards:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch wards"
      );
    }
  }
);

// Async thunk for fetching available wards
export const fetchAvailableWards = createAsyncThunk(
  "wardAndBedManagement/fetchAvailableWards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiWardAndBedManagement.getAvailableWards();
      return response?.data || response || [];
    } catch (error) {
      console.error("Error fetching available wards:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch available wards"
      );
    }
  }
);

// Async thunk for fetching ward by ID
export const fetchWardById = createAsyncThunk(
  "wardAndBedManagement/fetchWardById",
  async (wardId, { rejectWithValue }) => {
    try {
      const response = await ApiWardAndBedManagement.getWardById(wardId);
      return response?.data || response;
    } catch (error) {
      console.error("Error fetching ward by ID:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch ward"
      );
    }
  }
);

// Async thunk for creating/updating ward
export const upsertWard = createAsyncThunk(
  "wardAndBedManagement/upsertWard",
  async ({ wardId, wardName }, { rejectWithValue }) => {
    try {
      const data = { wardName };
      const response = await ApiWardAndBedManagement.upsertWard(wardId, data);
      return response?.data || response;
    } catch (error) {
      console.error("Error upserting ward:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to save ward"
      );
    }
  }
);

// Async thunk for adding rooms/beds
export const addRoom = createAsyncThunk(
  "wardAndBedManagement/addRoom",
  async ({ wardId, rooms }, { rejectWithValue }) => {
    try {
      const data = { rooms };
      const response = await ApiWardAndBedManagement.addRoom(wardId, data);
      return { wardId, data: response?.data || response };
    } catch (error) {
      console.error("Error adding room:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to add room"
      );
    }
  }
);

// Async thunk for updating room/bed
export const updateRoom = createAsyncThunk(
  "wardAndBedManagement/updateRoom",
  async ({ wardId, roomData }, { rejectWithValue }) => {
    try {
      const response = await ApiWardAndBedManagement.updateRoom(
        wardId,
        roomData
      );
      return { wardId, data: response?.data || response };
    } catch (error) {
      console.error("Error updating room:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update room"
      );
    }
  }
);

// Async thunk for deleting ward
export const deleteWard = createAsyncThunk(
  "wardAndBedManagement/deleteWard",
  async (wardId, { rejectWithValue }) => {
    try {
      await ApiWardAndBedManagement.deleteWard(wardId);
      return wardId;
    } catch (error) {
      console.error("Error deleting ward:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete ward"
      );
    }
  }
);

// Async thunk for deleting room/bed
export const deleteRoom = createAsyncThunk(
  "wardAndBedManagement/deleteRoom",
  async ({ wardId, roomId }, { rejectWithValue }) => {
    try {
      await ApiWardAndBedManagement.deleteRoom(wardId, roomId);
      return { wardId, roomId };
    } catch (error) {
      console.error("Error deleting room:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete room"
      );
    }
  }
);

// Async thunk for fetching ward stats
export const fetchWardStats = createAsyncThunk(
  "wardAndBedManagement/fetchWardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiWardAndBedManagement.getWardStats();
      return response?.data || response;
    } catch (error) {
      console.error("Error fetching ward stats:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch ward stats"
      );
    }
  }
);

// Async thunk for blocking room
export const blockRoom = createAsyncThunk(
  "wardAndBedManagement/blockRoom",
  async ({ wardId, roomId }, { rejectWithValue }) => {
    try {
      const response = await ApiWardAndBedManagement.blockRoom(wardId, roomId);
      console.log({ response });
      return { wardId, roomId };
    } catch (error) {
      console.error("Error blocking room:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to block room"
      );
    }
  }
);

// Async thunk for unblocking room
export const unblockRoom = createAsyncThunk(
  "wardAndBedManagement/unblockRoom",
  async ({ wardId, roomId }, { rejectWithValue }) => {
    try {
      await ApiWardAndBedManagement.unblockRoom(wardId, roomId);
      return { wardId, roomId };
    } catch (error) {
      console.error("Error unblocking room:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to unblock room"
      );
    }
  }
);

// Async thunk for bulk adding rooms
export const bulkAddRooms = createAsyncThunk(
  "wardAndBedManagement/bulkAddRooms",
  async ({ wardId, data }, { rejectWithValue }) => {
    try {
      const response = await ApiWardAndBedManagement.bulkAddRooms(wardId, data);
      return { wardId, data: response?.data || response };
    } catch (error) {
      console.error("Error bulk adding rooms:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to bulk add rooms"
      );
    }
  }
);

export const fetchBeds = createAsyncThunk(
  "wardAndBedManagement/fetchBeds",
  async (
    { wardId, filter = "", sort = null, page = 1, limit = 10, append = false },
    { rejectWithValue }
  ) => {
    try {
      const response = await ApiWardAndBedManagement.getBeds(
        wardId,
        filter,
        sort,
        page,
        limit
      );
      const data = response?.data || response;
      return {
        rooms: data?.rooms || [],
        pagination: data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        append, // Flag to indicate if we should append or replace
        wardId, // Store wardId to detect changes
      };
    } catch (error) {
      console.error("Error fetching beds:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch beds"
      );
    }
  }
);

export const fetchBedStatsByWard = createAsyncThunk(
  "wardAndBedManagement/fetchBedStatsByWard",
  async (wardId, { rejectWithValue }) => {
    try {
      const response = await ApiWardAndBedManagement.getBedStatsByWard(wardId);
      return response?.data || response;
    } catch (error) {
      console.error("Error fetching bed stats by ward:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch bed stats by ward"
      );
    }
  }
);

const initialState = {
  wards: {
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
  },
  availableWards: {
    data: [],
    loading: false,
    error: null,
  },
  selectedWard: {
    data: null,
    loading: false,
    error: null,
  },
  operations: {
    loading: false,
    error: null,
  },
  stats: {
    totalWards: 0,
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    blockedRooms: 0,
    loading: false,
    error: null,
  },
};

const wardAndBedManagementSlice = createSlice({
  name: "wardAndBedManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.wards.error = null;
      state.availableWards.error = null;
      state.selectedWard.error = null;
      state.operations.error = null;
    },
    clearSelectedWard: (state) => {
      state.selectedWard.data = null;
      state.selectedWard.error = null;
    },
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all wards
      .addCase(fetchAllWards.pending, (state) => {
        state.wards.loading = true;
        state.wards.error = null;
      })
      .addCase(fetchAllWards.fulfilled, (state, action) => {
        const newWards =
          action.payload?.wards
            ?.filter((ward) => !ward.isDeleted)
            .map(transformWardData) || [];

        // If append is true and search hasn't changed, append to existing data
        // Otherwise, replace the data (new search or first page)
        if (
          action.payload.append &&
          state.wards.pagination.search === action.payload.search
        ) {
          state.wards.data = [...state.wards.data, ...newWards];
        } else {
          state.wards.data = newWards;
        }

        state.wards.pagination =
          action.payload?.pagination || state.wards.pagination;
        state.wards.pagination.search = action.payload?.search || "";
        state.wards.loading = false;
      })
      .addCase(fetchAllWards.rejected, (state, action) => {
        state.wards.loading = false;
        state.wards.error = action.payload || "Failed to fetch wards";
      })

      // Fetch available wards
      .addCase(fetchAvailableWards.pending, (state) => {
        state.availableWards.loading = true;
        state.availableWards.error = null;
      })
      .addCase(fetchAvailableWards.fulfilled, (state, action) => {
        const wards = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.availableWards.data = wards
          ?.filter((ward) => ward.isDeleted !== true)
          .map(transformWardData);
        state.availableWards.loading = false;
      })
      .addCase(fetchAvailableWards.rejected, (state, action) => {
        state.availableWards.loading = false;
        state.availableWards.error =
          action.payload || "Failed to fetch available wards";
      })

      // Fetch ward by ID
      .addCase(fetchWardById.pending, (state) => {
        state.selectedWard.loading = true;
        state.selectedWard.error = null;
      })
      .addCase(fetchWardById.fulfilled, (state, action) => {
        state.selectedWard.data = transformWardData(action.payload);
        state.selectedWard.loading = false;
      })
      .addCase(fetchWardById.rejected, (state, action) => {
        state.selectedWard.loading = false;
        state.selectedWard.error = action.payload || "Failed to fetch ward";
      })

      // Upsert ward (create/update)
      .addCase(upsertWard.pending, (state) => {
        state.operations.loading = true;
        state.operations.error = null;
      })
      .addCase(upsertWard.fulfilled, (state, action) => {
        const updatedWard = transformWardData(action.payload);
        // Update in wards list if exists, otherwise add
        const index = state.wards.data.findIndex(
          (w) => w.id === updatedWard.id
        );
        if (index >= 0) {
          state.wards.data[index] = updatedWard;
        } else {
          state.wards.data.push(updatedWard);
        }
        state.operations.loading = false;
      })
      .addCase(upsertWard.rejected, (state, action) => {
        state.operations.loading = false;
        state.operations.error = action.payload || "Failed to save ward";
      })

      // Add room
      .addCase(addRoom.pending, (state) => {
        state.operations.loading = true;
        state.operations.error = null;
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        const { wardId } = action.payload;
        // Refresh the ward data by finding and updating it
        const wardIndex = state.wards.data.findIndex((w) => w.id === wardId);
        if (wardIndex >= 0) {
          // Trigger a refetch would be better, but for now update locally
          // The component should refetch after successful add
        }
        state.operations.loading = false;
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.operations.loading = false;
        state.operations.error = action.payload || "Failed to add room";
      })

      // Update room
      .addCase(updateRoom.pending, (state) => {
        state.operations.loading = true;
        state.operations.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        const { wardId } = action.payload;
        // Refresh the ward data
        const wardIndex = state.wards.data.findIndex((w) => w.id === wardId);
        if (wardIndex >= 0) {
          // Trigger a refetch would be better
        }
        state.operations.loading = false;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.operations.loading = false;
        state.operations.error = action.payload || "Failed to update room";
      })

      // Delete ward
      .addCase(deleteWard.pending, (state) => {
        state.operations.loading = true;
        state.operations.error = null;
      })
      .addCase(deleteWard.fulfilled, (state, action) => {
        const wardId = action.payload;
        state.wards.data = state.wards.data.filter((w) => w.id !== wardId);
        // Clear selected ward if it was deleted
        if (state.selectedWard.data?.id === wardId) {
          state.selectedWard.data = null;
        }
        state.operations.loading = false;
      })
      .addCase(deleteWard.rejected, (state, action) => {
        state.operations.loading = false;
        state.operations.error = action.payload || "Failed to delete ward";
      })

      // Delete room
      .addCase(deleteRoom.pending, (state) => {
        state.operations.loading = true;
        state.operations.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        const { wardId } = action.payload;
        // Refresh the ward data
        const wardIndex = state.wards.data.findIndex((w) => w.id === wardId);
        if (wardIndex >= 0) {
          // Trigger a refetch would be better
        }
        state.operations.loading = false;
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.operations.loading = false;
        state.operations.error = action.payload || "Failed to delete room";
      })

      // Fetch ward stats
      .addCase(fetchWardStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(fetchWardStats.fulfilled, (state, action) => {
        const {
          totalWards,
          totalRooms,
          availableRooms,
          occupiedRooms,
          blockedRooms,
        } = action.payload;
        state.stats.totalWards = totalWards;
        state.stats.totalBeds = totalRooms;
        state.stats.availableBeds = availableRooms;
        state.stats.occupiedBeds = occupiedRooms;
        state.stats.blockedBeds = blockedRooms;
        state.stats.loading = false;
      })
      .addCase(fetchWardStats.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload || "Failed to fetch ward stats";
      });
  },
});

export const { clearError, clearSelectedWard, resetState } =
  wardAndBedManagementSlice.actions;

export default wardAndBedManagementSlice.reducer;
