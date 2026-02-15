import React, { useEffect, useState } from "react";
import {
  Table,
  FloatButton,
  Button,
  message,
  Card,
  Select,
  Pagination,
  Input,
  Space,
} from "antd";
import {
  SyncOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  FilterOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { searchJobs, viewJobs, archiveJob } from "../api/api";
import { setResultsBySpecialty } from "../store/resultsSlice";
import type { APIResult, Level } from "@jobs4palestine/shared";
import { levels } from "@jobs4palestine/shared";

import dayjs from "dayjs";
import { ShowIf } from "../components/ShowIf";
type LevelSelectorProps = {
  selectedLevel: Level | null;
  setSelectedLevel: React.Dispatch<React.SetStateAction<Level | null>>;
};
const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  setSelectedLevel,
}) => {
  const handleChange = React.useCallback(
    (level: Level | null) => {
      setSelectedLevel(level);
    },
    [setSelectedLevel]
  );
  return (
    <div style={{ width: "150px" }}>
      <Select
        style={{ width: "100%" }}
        defaultValue={null}
        value={selectedLevel}
        onChange={handleChange}
        options={[...levels, null].map((level) => {
          if (level === null) {
            return { value: level, label: "All" };
          }
          const formattedLevel = level.charAt(0) + level.slice(1).toLowerCase();
          return { value: level, label: formattedLevel };
        })}
      />
    </div>
  );
};
const TableView: React.FC = () => {
  const dispatch = useDispatch();

  // All state declarations first
  const [currentCount, setCurrentCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [filterArchived, setFilterArchived] = useState(false);
  const [customSearch, setCustomSearch] = useState<string>("");
  const [customSearchMode, setCustomSearchMode] = useState<boolean>(false);
  const [activeCustomSearch, setActiveCustomSearch] = useState<string>("");

  const limit = 200;
  const userType = localStorage.getItem("userType");

  const availablePages = React.useMemo(() => {
    return Math.ceil(currentCount / limit);
  }, [currentCount]);

  const selectedSpecialty = useSelector(
    (state: RootState) => state.specialty.selectedSpecialty
  );

  // Use activeCustomSearch as the key when in custom search mode
  const activeSearchKey = customSearchMode ? activeCustomSearch : selectedSpecialty;

  const data = useSelector((state: RootState) =>
    activeSearchKey ? state.results[activeSearchKey] || [] : []
  );

  const filteredData = filterArchived
    ? data.filter((item) => !item.archived)
    : data;

  const columns: ColumnsType<APIResult> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: APIResult) => (
        <a href={record.link} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },

    { title: "Domain", dataIndex: "domain", key: "domain" },
    { title: "Description", dataIndex: "snippet", key: "snippet" },
    {
      title: "Date Published",
      dataIndex: "date_published",
      key: "date_published",
      render: (date: string) => {
        const publishedDate = dayjs(date);
        const daysAgo = dayjs().diff(publishedDate, "day");
        return `${publishedDate.format("YYYY-MM-DD")} (${
          daysAgo === 0 ? "Today" : `${daysAgo} days ago`
        })`;
      },
    },
    {
      title: (
        <LevelSelector
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
        />
      ),
      dataIndex: "level",
      key: "level",
    },
  ];

  if (userType === "admin") {
    columns.push({
      title: "Actions",
      key: "actions",
      width: 150, // Fixed width for the Actions column
      render: (_, record) => (
        <Button
          type={record.archived ? "default" : "primary"}
          icon={
            record.archived ? <ExclamationCircleOutlined /> : <DeleteOutlined />
          }
          danger={!record.archived} // Make the button red if not archived
          onClick={() => handleArchiveClick(record._id, record.archived)}
          style={{ minWidth: 100 }} // Ensures consistent button width
        >
          {record.archived ? "Unarchive" : "Archive"}
        </Button>
      ),
    });
  }
  useEffect(() => {
    setPage(1);
  }, [selectedSpecialty, selectedLevel]);
  const handleChangingPage = React.useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage]
  );

  useEffect(() => {
    const searchKey = customSearchMode ? activeCustomSearch : selectedSpecialty;
    if (searchKey) {
      setLoading(true);

      viewJobs({
        specialty: customSearchMode ? undefined : selectedSpecialty,
        customSearch: customSearchMode ? activeCustomSearch : undefined,
        level: selectedLevel,
        page,
      }).then(({ results, count }) => {
        setCurrentCount(count);

        dispatch(
          setResultsBySpecialty({ specialty: searchKey, results })
        );
        setLoading(false);
      });
    }
  }, [selectedSpecialty, selectedLevel, page, dispatch, activeCustomSearch, customSearchMode]);

  const handleSearchClick = React.useCallback(async () => {
    const searchKey = customSearchMode ? activeCustomSearch : selectedSpecialty;
    if (!searchKey) return;

    setLoading(true);
    try {
      const results = await searchJobs({
        specialty: customSearchMode ? undefined : selectedSpecialty,
        customSearch: customSearchMode ? activeCustomSearch : undefined,
        level: selectedLevel,
      });
      dispatch(
        setResultsBySpecialty({ specialty: searchKey, results })
      );
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, dispatch, selectedSpecialty, selectedLevel, activeCustomSearch, customSearchMode]);
  const handleArchiveClick = async (objectId: string, archived: boolean) => {
    if (selectedSpecialty) {
      setLoading(true);
      try {
        // If the item is currently archived, we want to unarchive it (send false); otherwise, we want to archive it (send true)
        await archiveJob(objectId, !archived);
        message.success(
          `Item has been ${archived ? "unarchived" : "archived"}.`
        );

        // Update the specific item in the local Redux state
        const updatedResults = data.map((item) =>
          item._id === objectId ? { ...item, archived: !archived } : item
        );
        dispatch(
          setResultsBySpecialty({
            specialty: selectedSpecialty,
            results: updatedResults,
          })
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        message.error(
          `Failed to ${archived ? "unarchive" : "archive"} the item.`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleFilterArchived = () => {
    setFilterArchived((prev) => !prev);
  };

  const downloadCSV = () => {
    if (filteredData.length === 0) {
      message.warning("No data to download");
      return;
    }

    // Define CSV headers
    const headers = ["Title", "Link", "Domain", "Description", "Date Published", "Level", "Specialty"];

    // Convert data to CSV rows
    const csvRows = filteredData.map((item) => {
      const datePublished = item.date_published
        ? dayjs(item.date_published).format("YYYY-MM-DD")
        : "";

      return [
        `"${(item.title || "").replace(/"/g, '""')}"`, // Escape quotes
        `"${(item.link || "").replace(/"/g, '""')}"`,
        `"${(item.domain || "").replace(/"/g, '""')}"`,
        `"${(item.snippet || "").replace(/"/g, '""')}"`,
        datePublished,
        item.level || "",
        `"${(item.speciality || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const filename = `jobs_${activeSearchKey || "export"}_${dayjs().format("YYYY-MM-DD")}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(`Downloaded ${filteredData.length} jobs to ${filename}`);
  };

  const handleCustomSearchSubmit = () => {
    if (customSearch.trim()) {
      setActiveCustomSearch(customSearch.trim());
      setCustomSearchMode(true);
      setPage(1);
    }
  };

  const handleBackToSpecialty = () => {
    setCustomSearchMode(false);
    setCustomSearch("");
    setActiveCustomSearch("");
    setPage(1);
  };

  return (
    <Card style={{ margin: 24, padding: 16 }}>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        {userType === "admin" && (
          <>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="Custom search (e.g., 'data scientist', 'product manager')"
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
                onPressEnter={handleCustomSearchSubmit}
                disabled={loading}
                prefix={<SearchOutlined />}
              />
              <Button
                type="primary"
                onClick={handleCustomSearchSubmit}
                disabled={!customSearch.trim() || loading}
              >
                Search
              </Button>
            </Space.Compact>
            {customSearchMode && (
              <Button
                type="link"
                onClick={handleBackToSpecialty}
                style={{ padding: 0 }}
              >
                ← Back to {selectedSpecialty}
              </Button>
            )}
          </>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={downloadCSV}
            disabled={filteredData.length === 0}
          >
            Download CSV ({filteredData.length} jobs)
          </Button>
        </div>
      </Space>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Table<APIResult>
          dataSource={filteredData}
          columns={columns}
          rowKey={(record) => record.link}
          pagination={false}
          loading={loading}
        />
        <ShowIf condition={availablePages > 1}>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Pagination
              align="center"
              current={page}
              onChange={handleChangingPage}
              defaultCurrent={1}
              total={availablePages}
            />
          </div>
        </ShowIf>
      </div>

      {userType === "admin" && (
        <FloatButton.Group
          style={{
            position: "fixed",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <FloatButton icon={<SyncOutlined />} onClick={handleSearchClick} />
          <FloatButton
            icon={<FilterOutlined />}
            type={filterArchived ? "primary" : "default"}
            onClick={toggleFilterArchived}
          />
          <FloatButton icon={<DownloadOutlined />} onClick={downloadCSV} />
        </FloatButton.Group>
      )}
    </Card>
  );
};

export default TableView;
