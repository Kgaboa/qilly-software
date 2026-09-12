import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import { EnvironmentBadge } from '@/app/components/EnvironmentBadge';
import { 
  Database, 
  Table as TableIcon,
  Key,
  Link,
  Shield,
  Search,
  RefreshCw,
  ExternalLink,
  FileCode,
  Lock,
  Unlock,
  Eye,
  Hash,
  Type,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity
} from 'lucide-react';

interface TableInfo {
  table_name: string;
  row_count: number;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

interface ForeignKey {
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
  constraint_name: string;
}

interface IndexInfo {
  tablename: string;
  indexname: string;
  indexdef: string;
}

interface RLSPolicy {
  tablename: string;
  policyname: string;
  permissive: string;
  roles: string[];
  cmd: string;
  qual: string | null;
  with_check: string | null;
}

export function DatabaseInspector() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [columns, setColumns] = useState<Record<string, ColumnInfo[]>>({});
  const [foreignKeys, setForeignKeys] = useState<ForeignKey[]>([]);
  const [indexes, setIndexes] = useState<IndexInfo[]>([]);
  const [rlsPolicies, setRlsPolicies] = useState<RLSPolicy[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionInfo, setConnectionInfo] = useState({
    host: '',
    database: '',
    connected: false
  });

  useEffect(() => {
    loadDatabaseSchema();
  }, []);

  const loadDatabaseSchema = async () => {
    setIsLoading(true);
    
    try {
      // Skip Supabase connection test - always use demo mode to avoid fetch errors
      console.log('Database Inspector: Using demo mode (Supabase not configured)');
      setConnectionInfo({
        host: 'demo-placeholder.supabase.co',
        database: 'postgres (demo mode)',
        connected: false
      });
      loadDemoSchema();
      
    } catch (err) {
      console.error('Error loading database schema:', err);
      // Silent fail - show demo mode instead of error
      setConnectionInfo({
        host: 'demo-placeholder.supabase.co',
        database: 'postgres (demo mode)',
        connected: false
      });
      loadDemoSchema();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoSchema = () => {
    // Show demo/documentation schema when not connected
    setTables([
      { table_name: 'users', row_count: 0 },
      { table_name: 'bills', row_count: 0 },
      { table_name: 'bill_items', row_count: 0 },
      { table_name: 'suppliers', row_count: 0 },
      { table_name: 'supplier_products', row_count: 0 }
    ]);

    setColumns({
      users: [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()', character_maximum_length: null },
        { column_name: 'email', data_type: 'text', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: 'now()', character_maximum_length: null },
        { column_name: 'trial_bills_remaining', data_type: 'integer', is_nullable: 'YES', column_default: '3', character_maximum_length: null },
        { column_name: 'is_premium', data_type: 'boolean', is_nullable: 'YES', column_default: 'false', character_maximum_length: null },
        { column_name: 'subscription_expires_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'full_name', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'company_name', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'phone', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null }
      ],
      bills: [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()', character_maximum_length: null },
        { column_name: 'user_id', data_type: 'uuid', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'project_name', data_type: 'text', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'bill_number', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: 'now()', character_maximum_length: null },
        { column_name: 'updated_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: 'now()', character_maximum_length: null },
        { column_name: 'status', data_type: 'text', is_nullable: 'YES', column_default: "'draft'", character_maximum_length: null },
        { column_name: 'total_cost', data_type: 'numeric', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'currency', data_type: 'text', is_nullable: 'YES', column_default: "'ZAR'", character_maximum_length: null },
        { column_name: 'notes', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'uploaded_via', data_type: 'text', is_nullable: 'YES', column_default: "'manual'", character_maximum_length: null }
      ],
      bill_items: [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()', character_maximum_length: null },
        { column_name: 'bill_id', data_type: 'uuid', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'item_number', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'description', data_type: 'text', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'unit', data_type: 'text', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'quantity', data_type: 'numeric', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'unit_price', data_type: 'numeric', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'total_price', data_type: 'numeric', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'supplier_name', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'supplier_id', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'category', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'notes', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null }
      ],
      suppliers: [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()', character_maximum_length: null },
        { column_name: 'name', data_type: 'text', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'category', data_type: 'text', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'contact_email', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'contact_phone', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'website', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'is_active', data_type: 'boolean', is_nullable: 'YES', column_default: 'true', character_maximum_length: null },
        { column_name: 'logo_url', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null }
      ],
      supplier_products: [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()', character_maximum_length: null },
        { column_name: 'supplier_id', data_type: 'uuid', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'product_code', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'description', data_type: 'text', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'unit', data_type: 'text', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'unit_price', data_type: 'numeric', is_nullable: 'NO', column_default: null, character_maximum_length: null },
        { column_name: 'category', data_type: 'text', is_nullable: 'YES', column_default: null, character_maximum_length: null },
        { column_name: 'is_available', data_type: 'boolean', is_nullable: 'YES', column_default: 'true', character_maximum_length: null }
      ]
    });

    setForeignKeys([
      { table_name: 'bills', column_name: 'user_id', foreign_table_name: 'users', foreign_column_name: 'id', constraint_name: 'bills_user_id_fkey' },
      { table_name: 'bill_items', column_name: 'bill_id', foreign_table_name: 'bills', foreign_column_name: 'id', constraint_name: 'bill_items_bill_id_fkey' },
      { table_name: 'supplier_products', column_name: 'supplier_id', foreign_table_name: 'suppliers', foreign_column_name: 'id', constraint_name: 'supplier_products_supplier_id_fkey' }
    ]);

    setIndexes([
      { tablename: 'bills', indexname: 'idx_bills_user_id', indexdef: 'CREATE INDEX idx_bills_user_id ON bills(user_id)' },
      { tablename: 'bills', indexname: 'idx_bills_created_at', indexdef: 'CREATE INDEX idx_bills_created_at ON bills(created_at DESC)' },
      { tablename: 'bill_items', indexname: 'idx_bill_items_bill_id', indexdef: 'CREATE INDEX idx_bill_items_bill_id ON bill_items(bill_id)' },
      { tablename: 'suppliers', indexname: 'idx_suppliers_category', indexdef: 'CREATE INDEX idx_suppliers_category ON suppliers(category)' },
      { tablename: 'supplier_products', indexname: 'idx_supplier_products_supplier_id', indexdef: 'CREATE INDEX idx_supplier_products_supplier_id ON supplier_products(supplier_id)' }
    ]);
  };

  const loadTables = async () => {
    const { data, error } = await supabase.rpc('get_table_list' as any);
    
    if (error) {
      // Fallback: Try to get tables manually
      const tableNames = ['users', 'bills', 'bill_items', 'suppliers', 'supplier_products'];
      const tableInfo: TableInfo[] = [];
      
      for (const tableName of tableNames) {
        try {
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          tableInfo.push({ table_name: tableName, row_count: count || 0 });
        } catch (err) {
          tableInfo.push({ table_name: tableName, row_count: 0 });
        }
      }
      
      setTables(tableInfo);
      return;
    }
    
    setTables(data || []);
  };

  const loadColumns = async () => {
    const tableNames = ['users', 'bills', 'bill_items', 'suppliers', 'supplier_products'];
    const columnsData: Record<string, ColumnInfo[]> = {};
    
    for (const tableName of tableNames) {
      const { data, error } = await supabase.rpc('get_table_columns' as any, { table_name: tableName });
      
      if (!error && data) {
        columnsData[tableName] = data;
      }
    }
    
    setColumns(columnsData);
  };

  const loadForeignKeys = async () => {
    const { data, error } = await supabase.rpc('get_foreign_keys' as any);
    
    if (!error && data) {
      setForeignKeys(data);
    }
  };

  const loadIndexes = async () => {
    const { data, error } = await supabase.rpc('get_indexes' as any);
    
    if (!error && data) {
      setIndexes(data);
    }
  };

  const loadRLSPolicies = async () => {
    const { data, error } = await supabase.rpc('get_rls_policies' as any);
    
    if (!error && data) {
      setRlsPolicies(data);
    }
  };

  const loadTableData = async (tableName: string) => {
    setSelectedTable(tableName);
    
    // Don't try to fetch data if not connected
    if (!connectionInfo.connected) {
      setTableData([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(50);
      
      if (error) {
        console.error('Error loading table data:', error);
        // Don't show toast error in demo mode
        if (connectionInfo.connected) {
          toast.error(`Failed to load data from ${tableName}`);
        }
        setTableData([]);
        return;
      }
      
      setTableData(data || []);
    } catch (err) {
      console.error('Error loading table data:', err);
      // Silent fail in demo mode
      setTableData([]);
    }
  };

  const getDataTypeIcon = (dataType: string) => {
    if (dataType.includes('uuid')) return <Key className="w-4 h-4 text-purple-500" />;
    if (dataType.includes('text') || dataType.includes('character')) return <Type className="w-4 h-4 text-blue-500" />;
    if (dataType.includes('int') || dataType.includes('numeric')) return <Hash className="w-4 h-4 text-green-500" />;
    if (dataType.includes('boolean')) return <CheckCircle className="w-4 h-4 text-orange-500" />;
    if (dataType.includes('timestamp')) return <Activity className="w-4 h-4 text-indigo-500" />;
    return <FileCode className="w-4 h-4 text-gray-500" />;
  };

  const filteredTables = tables.filter(table =>
    table.table_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard/project/tjajhzepupsmunewfvag', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-500" />
            Database Inspector
          </h2>
          <p className="text-slate-600 mt-1 flex items-center gap-2">
            View and explore your Qilly PostgreSQL database structure
            <EnvironmentBadge />
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadDatabaseSchema}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={openSupabaseDashboard}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <ExternalLink className="w-4 h-4" />
            Open Supabase Dashboard
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${connectionInfo.connected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              <div>
                <p className="font-semibold text-slate-900">
                  {connectionInfo.connected ? 'Connected to Database' : 'Demo Mode - Not Connected'}
                </p>
                <p className="text-sm text-slate-600">
                  Host: {connectionInfo.host} | Database: {connectionInfo.database}
                </p>
              </div>
            </div>
            {!connectionInfo.connected && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                <AlertCircle className="w-3 h-3 mr-1" />
                Showing Schema Documentation
              </Badge>
            )}
          </div>
          
          {/* Setup Instructions for Demo Mode */}
          {!connectionInfo.connected && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">Setup Your Own Supabase Database</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    You're currently viewing the demo schema. To connect to a real database:
                  </p>
                  <ol className="text-sm text-blue-800 space-y-2 ml-4 list-decimal">
                    <li>Create a free Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">supabase.com</a></li>
                    <li>Copy your Project ID and Anon Key from project settings</li>
                    <li>Update <code className="bg-blue-100 px-1 rounded">/src/utils/supabase/info.ts</code> with your credentials</li>
                    <li>Run the SQL setup script from <code className="bg-blue-100 px-1 rounded">/SUPABASE_SETUP_COMPLETE.sql</code></li>
                  </ol>
                  <p className="text-sm text-blue-800 mt-3">
                    📖 <strong>Complete guide:</strong> See <code className="bg-blue-100 px-1 rounded">/SETUP_YOUR_SUPABASE.md</code> for step-by-step instructions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">
            <TableIcon className="w-4 h-4 mr-2" />
            Tables Overview
          </TabsTrigger>
          <TabsTrigger value="columns">
            <FileCode className="w-4 h-4 mr-2" />
            Columns
          </TabsTrigger>
          <TabsTrigger value="relationships">
            <Link className="w-4 h-4 mr-2" />
            Relationships
          </TabsTrigger>
          <TabsTrigger value="indexes">
            <Key className="w-4 h-4 mr-2" />
            Indexes
          </TabsTrigger>
          <TabsTrigger value="data">
            <Eye className="w-4 h-4 mr-2" />
            Browse Data
          </TabsTrigger>
        </TabsList>

        {/* Tables Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>
                {tables.length} table{tables.length !== 1 ? 's' : ''} in your Qilly database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTables.map((table) => (
                  <Card key={table.table_name} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TableIcon className="w-5 h-5 text-blue-500" />
                          <h3 className="font-semibold text-slate-900">{table.table_name}</h3>
                        </div>
                        <Badge variant="secondary">{table.row_count} rows</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Columns:</span>
                          <span className="font-medium">{columns[table.table_name]?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Foreign Keys:</span>
                          <span className="font-medium">
                            {foreignKeys.filter(fk => fk.table_name === table.table_name).length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Indexes:</span>
                          <span className="font-medium">
                            {indexes.filter(idx => idx.tablename === table.table_name).length}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => {
                          setActiveTab('data');
                          loadTableData(table.table_name);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Data
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Columns Tab */}
        <TabsContent value="columns" className="space-y-4">
          {filteredTables.map((table) => (
            <Card key={table.table_name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-blue-500" />
                  {table.table_name}
                </CardTitle>
                <CardDescription>
                  {columns[table.table_name]?.length || 0} column{columns[table.table_name]?.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Column Name</TableHead>
                        <TableHead>Data Type</TableHead>
                        <TableHead>Nullable</TableHead>
                        <TableHead>Default</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {columns[table.table_name]?.map((column) => (
                        <TableRow key={column.column_name}>
                          <TableCell className="font-medium flex items-center gap-2">
                            {getDataTypeIcon(column.data_type)}
                            {column.column_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {column.data_type}
                              {column.character_maximum_length && `(${column.character_maximum_length})`}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {column.is_nullable === 'YES' ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                                <Unlock className="w-3 h-3 mr-1" />
                                Nullable
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                <Lock className="w-3 h-3 mr-1" />
                                NOT NULL
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-slate-600">
                            {column.column_default || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Relationships Tab */}
        <TabsContent value="relationships">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5 text-blue-500" />
                Foreign Key Relationships
              </CardTitle>
              <CardDescription>
                {foreignKeys.length} foreign key constraint{foreignKeys.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From Table</TableHead>
                      <TableHead>From Column</TableHead>
                      <TableHead></TableHead>
                      <TableHead>To Table</TableHead>
                      <TableHead>To Column</TableHead>
                      <TableHead>Constraint</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foreignKeys.map((fk, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{fk.table_name}</TableCell>
                        <TableCell className="font-mono text-sm">{fk.column_name}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-blue-500">→</span>
                        </TableCell>
                        <TableCell className="font-medium">{fk.foreign_table_name}</TableCell>
                        <TableCell className="font-mono text-sm">{fk.foreign_column_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {fk.constraint_name}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Indexes Tab */}
        <TabsContent value="indexes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-500" />
                Database Indexes
              </CardTitle>
              <CardDescription>
                {indexes.length} index{indexes.length !== 1 ? 'es' : ''} for query optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTables.map((table) => {
                  const tableIndexes = indexes.filter(idx => idx.tablename === table.table_name);
                  if (tableIndexes.length === 0) return null;

                  return (
                    <div key={table.table_name}>
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <TableIcon className="w-4 h-4 text-blue-500" />
                        {table.table_name}
                      </h3>
                      <div className="space-y-2">
                        {tableIndexes.map((idx, index) => (
                          <Card key={index} className="bg-slate-50">
                            <CardContent className="pt-4 pb-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-sm mb-1">{idx.indexname}</p>
                                  <code className="text-xs bg-white px-2 py-1 rounded border">
                                    {idx.indexdef}
                                  </code>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browse Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    Browse Table Data
                  </CardTitle>
                  <CardDescription>
                    {selectedTable ? `Showing up to 50 rows from ${selectedTable}` : 'Select a table to view data'}
                  </CardDescription>
                </div>
                {selectedTable && (
                  <Badge variant="secondary">{tableData.length} rows loaded</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex gap-2 flex-wrap">
                  {tables.map((table) => (
                    <Button
                      key={table.table_name}
                      variant={selectedTable === table.table_name ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => loadTableData(table.table_name)}
                    >
                      {table.table_name}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedTable && tableData.length > 0 && (
                <ScrollArea className="h-[500px] rounded-md border">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(tableData[0]).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((row, index) => (
                          <TableRow key={index}>
                            {Object.values(row).map((value: any, cellIndex) => (
                              <TableCell key={cellIndex} className="font-mono text-xs">
                                {value === null ? (
                                  <span className="text-gray-400 italic">null</span>
                                ) : typeof value === 'boolean' ? (
                                  value ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )
                                ) : typeof value === 'object' ? (
                                  JSON.stringify(value)
                                ) : (
                                  String(value)
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              )}

              {selectedTable && tableData.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No data found in {selectedTable}</p>
                </div>
              )}

              {!selectedTable && (
                <div className="text-center py-12">
                  <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Select a table to browse its data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Access Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">Direct Database Access</h3>
              <p className="text-sm text-slate-600 mb-4">
                For full database management capabilities, including SQL queries, schema modifications, and advanced features, 
                open your Supabase dashboard.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={openSupabaseDashboard}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Supabase Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = 'https://supabase.com/dashboard/project/tjajhzepupsmunewfvag';
                    try {
                      const textArea = document.createElement('textarea');
                      textArea.value = url;
                      textArea.style.position = 'fixed';
                      textArea.style.left = '-999999px';
                      textArea.style.top = '-999999px';
                      document.body.appendChild(textArea);
                      textArea.focus();
                      textArea.select();
                      const successful = document.execCommand('copy');
                      document.body.removeChild(textArea);
                      if (successful) {
                        toast.success('Dashboard URL copied to clipboard');
                      } else {
                        toast.error('Copy failed. Please copy manually.');
                      }
                    } catch (err) {
                      toast.error('Copy failed. Please copy manually.');
                    }
                  }}
                >
                  Copy Dashboard URL
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}