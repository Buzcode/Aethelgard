<?php

namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PersonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Simply fetch all people from the database
        return Person::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'portrait_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create and store the new person
        $person = Person::create($request->all());

        // Return a success response
        return response()->json($person, 201);
    }

    /**
     * Display the specified resource.
     */
   public function show(Person $person)
{
    return $person;
}

    /**
     * Update the specified resource in storage.
     */
       /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Person $person)
    {
        // Validate the request data (same as store, but name isn't always required)
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255', // No 'required' rule on update
            'birth_date' => 'nullable|string|max:255',
            'death_date' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'portrait_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Update the person's data
        $person->update($request->all());

        // Return the updated person data
        return response()->json($person);
    }   
    /**    
     * Remove the specified resource from storage.
     */
    public function destroy(Person $person)
    {  
        // First, we ensure we have the model instance, then we delete it.
        $person->delete();

        // We return a response with a success message and a 200 OK status.
        // While 204 is technically correct, 200 with a message is often
        // easier to debug on the frontend.
        return response()->json(['message' => 'Person deleted successfully.']);
    }
}
