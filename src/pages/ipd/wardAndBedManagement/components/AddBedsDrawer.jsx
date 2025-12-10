import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { Drawer } from "antd";
import BedSummaryCards from "./BedSummaryCards";
import BedsListTable from "./BedsListTable";
import WardSelector from "./WardSelector";
import BedFormTabs from "./BedFormTabs";
import MultipleBedsForm from "./forms/MultipleBedsForm";
import SingleBedForm from "./forms/SingleBedForm";
import "./AddBedsDrawer.scss";
import {
  addRoom,
  bulkAddRooms,
  fetchAllWards,
  fetchBeds,
  fetchBedStatsByWard,
} from "../../../../redux/ipd/wardAndBedManagementSlice";
import { TABS, BED_NAME_FORMAT } from "../constants";
import { transformBedsFromAPI } from "../utils/bedUtils";
import crossIcon from "../../../../assets/images/icons/cross.svg";

// Map component bed name format to API format
const mapBedNameFormatToAPI = (format) => {
  switch (format) {
    case BED_NAME_FORMAT.PREFIX:
      return "prefix";
    case BED_NAME_FORMAT.SUFFIX:
      return "suffix";
    case BED_NAME_FORMAT.BOTH:
      return "both";
    case BED_NAME_FORMAT.NONE:
      return "none";
    default:
      return "prefix";
  }
};

const AddBedsDrawer = ({
  open,
  onClose,
  onSave, // Kept for backward compatibility but not used (beds are saved immediately)
  selectedWard,
  wards = [],
  onAddNewWard,
  currentSearchQuery = "",
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(TABS.MULTIPLE);
  const [numberOfBeds, setNumberOfBeds] = useState("");
  const [bedNameFormat, setBedNameFormat] = useState(BED_NAME_FORMAT.PREFIX);
  const [prefixText, setPrefixText] = useState("");
  const [suffixText, setSuffixText] = useState("");
  const [startingNumber, setStartingNumber] = useState("");
  const [singleBedName, setSingleBedName] = useState("");
  const [currentSelectedWard, setCurrentSelectedWard] = useState(
    selectedWard?.id || null
  );

  const [fetchedBeds, setFetchedBeds] = useState([]);
  const [bedsLoading, setBedsLoading] = useState(false);
  const [bedsPagination, setBedsPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [bedsCurrentPage, setBedsCurrentPage] = useState(1);
  const [bedsStatusFilter, setBedsStatusFilter] = useState(null);
  const [bedStats, setBedStats] = useState({
    totalBeds: 0,
    availableBeds: 0,
    occupiedBeds: 0,
    blockedBeds: 0,
  });

  // Sync selected ward when drawer opens or selectedWard prop changes
  useEffect(() => {
    if (open && selectedWard?.id) {
      setCurrentSelectedWard(selectedWard.id);
    } else if (!open) {
      // Reset when drawer closes
      setCurrentSelectedWard(null);
      setFetchedBeds([]);
    }
  }, [open, selectedWard]);

  // Reusable function to refresh beds for a ward
  const refreshBeds = useCallback(
    async (wardId, page = 1, append = false, filter = null) => {
      if (!wardId) return;

      try {
        // Build filter string - if status filter is set, use it
        const filterString = filter || bedsStatusFilter || "";

        const result = await dispatch(
          fetchBeds({
            wardId,
            filter: filterString,
            sort: null,
            page,
            limit: 50,
            append,
          })
        ).unwrap();

        const transformedBeds = transformBedsFromAPI(result?.rooms || []);

        if (append) {
          setFetchedBeds((prev) => [...prev, ...transformedBeds]);
        } else {
          setFetchedBeds(transformedBeds);
        }

        setBedsPagination(
          result?.pagination || {
            page: 1,
            limit: 50,
            total: 0,
            totalPages: 0,
          }
        );
      } catch (error) {
        console.error("Error refreshing beds:", error);
        if (!append) {
          setFetchedBeds([]);
        }
      }
    },
    [dispatch, bedsStatusFilter]
  );

  // Fetch bed stats when currentSelectedWard changes
  const fetchBedStats = useCallback(
    async (wardId) => {
      if (!wardId) {
        setBedStats({
          totalBeds: 0,
          availableBeds: 0,
          occupiedBeds: 0,
          blockedBeds: 0,
        });
        return;
      }

      try {
        const result = await dispatch(fetchBedStatsByWard(wardId)).unwrap();

        // Map API response to component format
        setBedStats({
          totalBeds: result?.totalRooms || 0,
          availableBeds: result?.availableRooms || 0,
          occupiedBeds: result?.occupiedRooms || 0,
          blockedBeds: result?.blockedRooms || 0,
        });
      } catch (error) {
        console.error("Error fetching bed stats:", error);
        setBedStats({
          totalBeds: 0,
          availableBeds: 0,
          occupiedBeds: 0,
          blockedBeds: 0,
        });
      }
    },
    [dispatch]
  );

  // Reset beds pagination when ward changes or filter changes
  useEffect(() => {
    if (currentSelectedWard) {
      setBedsCurrentPage(1);
      setBedsPagination({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      });
    }
  }, [currentSelectedWard, bedsStatusFilter]);

  // Fetch beds and stats when currentSelectedWard changes
  useEffect(() => {
    if (currentSelectedWard && open) {
      const loadBeds = async () => {
        setBedsLoading(true);
        try {
          await refreshBeds(currentSelectedWard, 1, false);
          setBedsCurrentPage(1);
        } finally {
          setBedsLoading(false);
        }
      };

      loadBeds();
      // Fetch bed stats
      fetchBedStats(currentSelectedWard);
    } else if (!currentSelectedWard) {
      setFetchedBeds([]);
      setBedsCurrentPage(1);
      setBedStats({
        totalBeds: 0,
        availableBeds: 0,
        occupiedBeds: 0,
        blockedBeds: 0,
      });
      // Clear filter when ward is deselected
      setBedsStatusFilter(null);
    }
  }, [currentSelectedWard, open, refreshBeds, fetchBedStats, bedsStatusFilter]);

  // Load more beds for infinite scroll
  const handleLoadMoreBeds = useCallback(() => {
    if (bedsLoading || !currentSelectedWard) return;
    const nextPage = bedsCurrentPage + 1;
    const hasMore = bedsPagination?.totalPages > bedsCurrentPage;

    if (hasMore) {
      setBedsLoading(true);
      setBedsCurrentPage(nextPage);
      // Pass current filter when loading more
      refreshBeds(
        currentSelectedWard,
        nextPage,
        true,
        bedsStatusFilter
      ).finally(() => {
        setBedsLoading(false);
      });
    }
  }, [
    bedsCurrentPage,
    bedsPagination,
    bedsLoading,
    currentSelectedWard,
    refreshBeds,
    bedsStatusFilter,
  ]);

  const handleWardSelect = useCallback((value) => {
    setCurrentSelectedWard(value);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    // Reset form when switching tabs
    setNumberOfBeds("");
    setPrefixText("");
    setSuffixText("");
    setStartingNumber("");
    setSingleBedName("");
  }, []);

  // Shared function to refresh data after bed operations
  const refreshDataAfterBedOperation = useCallback(
    async (wardId) => {
      await refreshBeds(wardId, 1, false);
      await fetchBedStats(wardId);
      await dispatch(
        fetchAllWards({
          search: currentSearchQuery.trim(),
          sort: null,
          page: 1,
          limit: 50,
        })
      );
    },
    [refreshBeds, fetchBedStats, dispatch, currentSearchQuery]
  );

  const generateBedPreview = useMemo(() => {
    if (activeTab === TABS.SINGLE) {
      return singleBedName || "";
    }

    const num = parseInt(startingNumber) || 0;
    let preview = "";

    switch (bedNameFormat) {
      case BED_NAME_FORMAT.PREFIX:
        if (!prefixText || !startingNumber) {
          return "";
        }
        preview = `${prefixText}${num}`;
        break;
      case BED_NAME_FORMAT.SUFFIX:
        if (!suffixText || !startingNumber) {
          return "";
        }
        preview = `${num}${suffixText}`;
        break;
      case BED_NAME_FORMAT.BOTH:
        if (!prefixText || !suffixText || !startingNumber) {
          return "";
        }
        preview = `${prefixText}${num}${suffixText}`;
        break;
      case BED_NAME_FORMAT.NONE:
        if (!startingNumber) {
          return "";
        }
        preview = `${num}`;
        break;
      default:
        if (!prefixText || !startingNumber) {
          return "";
        }
        preview = `${prefixText}${num}`;
    }

    return preview;
  }, [
    activeTab,
    bedNameFormat,
    prefixText,
    suffixText,
    startingNumber,
    singleBedName,
  ]);

  const isAddBedDisabled = useMemo(() => {
    if (activeTab === TABS.SINGLE) {
      return !singleBedName.trim();
    }

    if (!numberOfBeds || parseInt(numberOfBeds) <= 0) {
      return true;
    }

    if (bedNameFormat === BED_NAME_FORMAT.NONE) {
      return !startingNumber;
    }

    if (bedNameFormat === BED_NAME_FORMAT.PREFIX) {
      return !prefixText.trim() || !startingNumber;
    }

    if (bedNameFormat === BED_NAME_FORMAT.SUFFIX) {
      return !suffixText.trim() || !startingNumber;
    }

    if (bedNameFormat === BED_NAME_FORMAT.BOTH) {
      return !prefixText.trim() || !suffixText.trim() || !startingNumber;
    }

    return false;
  }, [
    activeTab,
    numberOfBeds,
    bedNameFormat,
    prefixText,
    suffixText,
    startingNumber,
    singleBedName,
  ]);

  const handleAddBed = useCallback(async () => {
    if (isAddBedDisabled || !currentSelectedWard) {
      if (!currentSelectedWard) {
        message.warning("Please select a ward first");
      }
      return;
    }

    try {
      if (activeTab === TABS.SINGLE) {
        // For single bed, call addRoom API immediately
        await dispatch(
          addRoom({
            wardId: currentSelectedWard,
            rooms: [
              {
                type: "bed",
                name: singleBedName.trim(),
              },
            ],
          })
        ).unwrap();

        message.success("Bed added successfully");
        setSingleBedName("");
        await refreshDataAfterBedOperation(currentSelectedWard);
      } else {
        // For multiple beds, call bulkAddRooms API immediately
        await dispatch(
          bulkAddRooms({
            wardId: currentSelectedWard,
            data: {
              noOfRooms: parseInt(numberOfBeds) || 0,
              bedNameAppear: mapBedNameFormatToAPI(bedNameFormat),
              startingNumber: startingNumber || "1",
              bedNamePrefix: prefixText.trim() || "",
              bedNameSuffix: suffixText.trim() || "",
              type: "bed",
            },
          })
        ).unwrap();

        const bedCount = parseInt(numberOfBeds) || 0;
        message.success(
          `${bedCount} ${bedCount > 1 ? "Beds" : "Bed"} added successfully`
        );

        // Reset form after adding
        setNumberOfBeds("");
        setPrefixText("");
        setSuffixText("");
        setStartingNumber("");
        await refreshDataAfterBedOperation(currentSelectedWard);
      }
    } catch (error) {
      console.error("Error adding bed(s):", error);
      message.error("Failed to add bed(s)");
    }
  }, [
    activeTab,
    isAddBedDisabled,
    currentSelectedWard,
    singleBedName,
    numberOfBeds,
    bedNameFormat,
    prefixText,
    suffixText,
    startingNumber,
    dispatch,
    refreshDataAfterBedOperation,
  ]);

  // Handle back button click - no unsaved changes since we save immediately
  const handleBackClick = useCallback(() => {
    onClose();
  }, [onClose]);

  // Get beds for the currently selected ward (use fetched beds from API)
  const currentWardBeds = useMemo(() => {
    if (!currentSelectedWard) return [];
    return fetchedBeds || [];
  }, [currentSelectedWard, fetchedBeds]);

  // Check if the selected ward has beds
  const hasBeds = useMemo(() => {
    if (!currentSelectedWard) return false;
    const selectedWardData = wards.find((w) => w.id === currentSelectedWard);
    return (
      (selectedWardData?.totalBeds && selectedWardData.totalBeds > 0) ||
      (selectedWardData?.rooms &&
        Array.isArray(selectedWardData.rooms) &&
        selectedWardData.rooms.length > 0) ||
      (currentWardBeds &&
        Array.isArray(currentWardBeds) &&
        currentWardBeds.length > 0)
    );
  }, [currentSelectedWard, wards, currentWardBeds]);

  // Determine drawer title based on whether ward has beds
  const drawerTitle = hasBeds ? "View/Edit Beds" : "Add Beds";

  // Use bed stats from API instead of calculating from beds array
  const bedSummary = useMemo(() => {
    return {
      totalBeds: bedStats.totalBeds,
      availableBeds: bedStats.availableBeds,
      occupiedBeds: bedStats.occupiedBeds,
      blockedBeds: bedStats.blockedBeds,
    };
  }, [bedStats]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={"1000px"}
      className="add-beds-drawer"
      closeIcon={false}
      destroyOnClose
    >
      <div className="add-beds-drawer-content">
        {/* Header */}
        <div className="add-beds-drawer-header">
          <div className="add-beds-drawer-header-left">
            <button
              onClick={handleBackClick}
              className="add-beds-drawer-back-btn"
            >
              <img src={crossIcon} className="icon-right" alt="Close" />
            </button>
            <h2 className="add-beds-drawer-title">{drawerTitle}</h2>
          </div>
        </div>

        {/* Ward Selection - Below Header */}
        <div className="add-beds-drawer-ward-selection">
          <WardSelector
            value={currentSelectedWard}
            onChange={handleWardSelect}
            wards={wards}
            onAddNewWard={onAddNewWard}
          />
        </div>

        {/* Body */}
        {currentSelectedWard && (
          <div className="add-beds-drawer-body">
            {/* Left Panel - Form */}
            <div className="add-beds-drawer-form-panel">
              {/* Form Container */}
              <div className="add-beds-form-container">
                <BedFormTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />

                {/* Form Content */}
                <div className="add-beds-form-content">
                  {activeTab === TABS.MULTIPLE ? (
                    <MultipleBedsForm
                      numberOfBeds={numberOfBeds}
                      setNumberOfBeds={setNumberOfBeds}
                      bedNameFormat={bedNameFormat}
                      setBedNameFormat={setBedNameFormat}
                      prefixText={prefixText}
                      setPrefixText={setPrefixText}
                      suffixText={suffixText}
                      setSuffixText={setSuffixText}
                      startingNumber={startingNumber}
                      setStartingNumber={setStartingNumber}
                      bedPreview={generateBedPreview}
                      onAddBed={handleAddBed}
                      isAddBedDisabled={isAddBedDisabled}
                    />
                  ) : (
                    <SingleBedForm
                      singleBedName={singleBedName}
                      setSingleBedName={setSingleBedName}
                      onAddBed={handleAddBed}
                      isAddBedDisabled={isAddBedDisabled}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Summary and Table */}
            <div className="add-beds-drawer-summary-panel">
              <BedSummaryCards summary={bedSummary} />
              <BedsListTable
                beds={currentWardBeds}
                pagination={bedsPagination}
                onLoadMore={handleLoadMoreBeds}
                wardName={
                  wards.find((w) => w.id === currentSelectedWard)?.wardName ||
                  selectedWard?.wardName
                }
                wardId={currentSelectedWard}
                loading={bedsLoading}
                currentSearchQuery={currentSearchQuery}
                onStatusFilterChange={(filterValue) => {
                  // Update filter and reset to page 1
                  // The useEffect will handle the API call when bedsStatusFilter changes
                  setBedsStatusFilter(filterValue);
                  setBedsCurrentPage(1);
                }}
                onBedUpdated={() => {
                  // Refresh beds data after update/delete
                  refreshBeds(currentSelectedWard, 1, false);
                  fetchBedStats(currentSelectedWard);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default React.memo(AddBedsDrawer);
