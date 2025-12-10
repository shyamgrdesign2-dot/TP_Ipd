import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, message } from "antd";
import SubHeader from "../inPatients/components/SubHeader";
import WardEmptyState from "./components/WardEmptyState";
import AddWardModal from "./components/AddWardModal";
import DeleteWardModal from "./components/DeleteWardModal";
import AddBedsDrawer from "./components/AddBedsDrawer";
import StatusCards from "./components/StatusCards";
import WardSearchBar from "./components/WardSearchBar";
import WardsTable from "./components/WardsTable";
import { defaultIcons } from "../../../assets/images/icons";
import {
  fetchAllWards,
  upsertWard,
  deleteWard,
  clearError,
  fetchWardStats,
} from "../../../redux/ipd/wardAndBedManagementSlice";
import { useDebounce } from "../inPatients/hooks/useDebounce";
import "./WardAndBedManagement.scss";
import { showSuccessToast } from "../../../utils/utils";

function WardAndBedManagement() {
  const dispatch = useDispatch();

  // Redux state
  const {
    wards: {
      data: wards,
      loading: wardsLoading,
      error: wardsError,
      pagination: wardsPagination,
    },
    operations: { error: operationsError },
  } = useSelector((state) => state.wardAndBedManagement);

  // Local state for UI
  const [isAddWardModalOpen, setIsAddWardModalOpen] = useState(false);
  const [isEditWardModalOpen, setIsEditWardModalOpen] = useState(false);
  const [isDeleteWardModalOpen, setIsDeleteWardModalOpen] = useState(false);
  const [selectedWardForEdit, setSelectedWardForEdit] = useState(null);
  const [selectedWardForDelete, setSelectedWardForDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBedsDrawerOpen, setIsAddBedsDrawerOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Track current page for infinite scroll
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Fetch wards on component mount and when search query changes
  useEffect(() => {
    dispatch(
      fetchAllWards({
        search: debouncedSearchQuery.trim(),
        sort: null,
        page: 1,
        limit: 50,
        append: false, // Replace data on new search
      })
    );
    setCurrentPage(1);
  }, [debouncedSearchQuery, dispatch]);

  // Load more wards for infinite scroll
  const handleLoadMoreWards = useCallback(() => {
    if (wardsLoading) return;
    const nextPage = currentPage + 1;
    const hasMore = wardsPagination?.totalPages > currentPage;

    if (hasMore) {
      setCurrentPage(nextPage);
      dispatch(
        fetchAllWards({
          search: debouncedSearchQuery.trim(),
          sort: null,
          page: nextPage,
          limit: 50,
          append: true, // Append to existing data
        })
      );
    }
  }, [
    currentPage,
    wardsPagination,
    wardsLoading,
    debouncedSearchQuery,
    dispatch,
  ]);

  // Fetch stats on component mount
  useEffect(() => {
    dispatch(fetchWardStats());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (wardsError) {
      message.error(wardsError);
      dispatch(clearError());
    }
  }, [wardsError, dispatch]);

  useEffect(() => {
    if (operationsError) {
      message.error(operationsError);
      dispatch(clearError());
    }
  }, [operationsError, dispatch]);

  const handleAddWardClick = useCallback(() => {
    setIsAddWardModalOpen(true);
  }, []);

  const handleAddBedClick = useCallback(() => {
    // Open drawer without a specific ward selected (user will select from dropdown)
    setSelectedWard(null);
    setIsAddBedsDrawerOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddWardModalOpen(false);
  }, []);

  const handleSaveWard = useCallback(
    async (wardName) => {
      try {
        // For new ward, wardId should be null or undefined
        await dispatch(upsertWard({ wardId: null, wardName })).unwrap();
        showSuccessToast({ title: "New Ward Added Successfully" });
        setIsAddWardModalOpen(false);
        // Refresh wards list to get the updated data with the new ward
        await dispatch(
          fetchAllWards({
            search: debouncedSearchQuery.trim(),
            sort: null,
            page: 1,
            limit: 50,
          })
        );
      } catch (error) {
        // Error is handled by Redux and shown in useEffect
        console.error("Error saving ward:", error);
      }
    },
    [dispatch, debouncedSearchQuery]
  );

  const handleEditWard = useCallback(
    async (wardName, wardId) => {
      try {
        await dispatch(upsertWard({ wardId, wardName })).unwrap();
        showSuccessToast({ title: "Ward Updated Successfully" });
        setIsEditWardModalOpen(false);
        setSelectedWardForEdit(null);
        // Refresh wards list
        dispatch(
          fetchAllWards({
            search: debouncedSearchQuery.trim(),
            sort: null,
            page: 1,
            limit: 50,
          })
        );
      } catch (error) {
        // Error is handled by Redux and shown in useEffect
        console.error("Error updating ward:", error);
      }
    },
    [dispatch, debouncedSearchQuery]
  );

  const handleDeleteWard = useCallback(
    async (wardId) => {
      try {
        await dispatch(deleteWard(wardId)).unwrap();
        showSuccessToast({ title: "Ward Deleted Successfully" });
        setIsDeleteWardModalOpen(false);
        setSelectedWardForDelete(null);
        // Wards list is automatically updated in Redux
      } catch (error) {
        // Error is handled by Redux and shown in useEffect
        console.error("Error deleting ward:", error);
      }
    },
    [dispatch]
  );

  const handleCloseEditWardModal = useCallback(() => {
    setIsEditWardModalOpen(false);
    setSelectedWardForEdit(null);
  }, []);

  const handleCloseDeleteWardModal = useCallback(() => {
    setIsDeleteWardModalOpen(false);
    setSelectedWardForDelete(null);
  }, []);

  const handleAddBeds = useCallback((ward) => {
    // Open drawer with the selected ward
    setSelectedWard(ward);
    setIsAddBedsDrawerOpen(true);
  }, []);

  const handleMoreActions = useCallback((ward, action) => {
    if (action === "add-edit-beds") {
      // Open drawer with the selected ward for adding/editing beds
      setSelectedWard(ward);
      setIsAddBedsDrawerOpen(true);
    } else if (action === "edit") {
      // Open edit modal with the selected ward
      setSelectedWardForEdit(ward);
      setIsEditWardModalOpen(true);
    } else if (action === "delete") {
      // Open delete modal with the selected ward
      setSelectedWardForDelete(ward);
      setIsDeleteWardModalOpen(true);
    }
  }, []);

  const handleCloseAddBedsDrawer = useCallback(() => {
    setIsAddBedsDrawerOpen(false);
    setSelectedWard(null);
  }, []);

  const handleSaveBeds = useCallback(async () => {
    // The actual save is handled in AddBedsDrawer component
    // This callback is called after successful save
    // Refresh wards list to get updated bed data
    await dispatch(
      fetchAllWards({
        search: debouncedSearchQuery.trim(),
        sort: null,
        page: 1,
        limit: 50,
      })
    );
    // Close drawer after save
    setIsAddBedsDrawerOpen(false);
    setSelectedWard(null);
  }, [dispatch, debouncedSearchQuery]);

  const handleAddNewWard = useCallback(
    async (wardName) => {
      try {
        const result = await dispatch(
          upsertWard({ wardId: null, wardName })
        ).unwrap();
        showSuccessToast({ title: "New Ward Added Successfully" });
        // Refresh wards list and wait for it to complete
        await dispatch(
          fetchAllWards({
            search: debouncedSearchQuery.trim(),
            sort: null,
            page: 1,
            limit: 50,
          })
        );
        // Return the ward name so AddBedsDrawer can find and select it
        return { wardName, result };
      } catch (error) {
        console.error("Error adding new ward:", error);
        throw error;
      }
    },
    [dispatch, debouncedSearchQuery]
  );

  // Check if there are no wards
  const hasNoWards = !searchQuery.trim() && (!wards || wards.length === 0);

  const headerActions = (
    <div className="d-flex gap-4 align-items-center">
      <Button
        icon={
          <img
            src={defaultIcons.plusIconColoured}
            width={20}
            height={20}
            alt="+"
          />
        }
        onClick={handleAddWardClick}
        className="add-ward-btn"
      >
        Add New Ward
      </Button>
      <div className="add-bed-btn-separator"></div>
      <Button
        type="primary"
        icon={<img src={defaultIcons.plusIcon} alt="+" />}
        onClick={handleAddBedClick}
        className="add-bed-btn"
      >
        Add New Bed
      </Button>
    </div>
  );

  return (
    <>
      <SubHeader
        headerTitle="Ward & Bed Management"
        showAddAdmission={false}
        actions={headerActions}
      />
      <div className="ward-bed-management-page-wrap">
        {hasNoWards ? (
          <WardEmptyState onAddWardClick={handleAddWardClick} />
        ) : (
          <div className="ward-bed-management-content">
            <div className="ward-bed-management-inner">
              <StatusCards />
              <WardSearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <WardsTable
                data={wards || []}
                loading={wardsLoading}
                onAddBeds={handleAddBeds}
                onMoreActions={handleMoreActions}
                pagination={wardsPagination}
                onLoadMore={handleLoadMoreWards}
              />
            </div>
          </div>
        )}
      </div>
      <AddWardModal
        open={isAddWardModalOpen}
        onCancel={handleCloseModal}
        onSave={handleSaveWard}
      />
      <AddWardModal
        open={isEditWardModalOpen}
        onCancel={handleCloseEditWardModal}
        onSave={handleEditWard}
        ward={selectedWardForEdit}
      />
      <DeleteWardModal
        open={isDeleteWardModalOpen}
        onCancel={handleCloseDeleteWardModal}
        onDelete={handleDeleteWard}
        ward={selectedWardForDelete}
      />
      <AddBedsDrawer
        open={isAddBedsDrawerOpen}
        onClose={handleCloseAddBedsDrawer}
        onSave={handleSaveBeds}
        selectedWard={selectedWard}
        wards={wards || []}
        beds={selectedWard?.rooms || []}
        onAddNewWard={handleAddNewWard}
        currentSearchQuery={debouncedSearchQuery}
      />
    </>
  );
}

export default React.memo(WardAndBedManagement);
